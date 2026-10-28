const cron = require("node-cron");
const Field = require("../models/Field");
const WeatherAdvisory = require("../models/WeatherAdvisory");
const Notification = require("../models/Notification");
const ScheduledJobRun = require("../models/ScheduledJobRun");
const { getForecastByCoords } = require("../services/weather/weatherService");

let isRunning = false;

const runWeatherCheck = async () => {
  if (isRunning) {
    console.log("[Weather Cron] Job already in progress, skipping overlapping run.");
    return;
  }

  isRunning = true;
  const jobRun = await ScheduledJobRun.create({
    jobName: "Weather & Irrigation Advisory Scanner",
    startedAt: new Date(),
  });

  try {
    const fields = await Field.find({
      status: "active",
      latitude: { $ne: null },
      longitude: { $ne: null },
    }).populate("farmer", "name mobile");

    let count = 0;
    const todayStr = new Date().toISOString().split("T")[0];

    for (const field of fields) {
      const forecast = await getForecastByCoords(field.latitude, field.longitude);

      if (forecast.alertType && forecast.alertType !== "normal") {
        const deduplicationKey = `${field.farmer._id}_${field._id}_${forecast.alertType}_${todayStr}`;

        const existing = await WeatherAdvisory.findOne({ deduplicationKey });
        if (!existing) {
          const advisory = await WeatherAdvisory.create({
            farmer: field.farmer._id,
            field: field._id,
            locationName: field.village,
            latitude: field.latitude,
            longitude: field.longitude,
            forecastSummary: {
              temperature: forecast.temperature,
              rainfallMm: forecast.rainMm,
              windSpeedKmh: forecast.windSpeedKmh,
              weatherCode: forecast.weatherCode,
              description: forecast.description,
            },
            alertType: forecast.alertType,
            severity: forecast.severity,
            message: forecast.adviceEn,
            suggestedActions: forecast.suggestedActions,
            deduplicationKey,
          });

          await Notification.create({
            recipient: field.farmer._id,
            title: `Weather Alert for ${field.name}`,
            message: `${forecast.description}: ${forecast.adviceEn}`,
            type: "weather",
            relatedEntity: "weather",
            relatedId: advisory._id,
          });

          count++;
        }
      }
    }

    jobRun.finishedAt = new Date();
    jobRun.status = "success";
    jobRun.recordsProcessed = count;
    await jobRun.save();
    console.log(`[Weather Cron] Checked ${fields.length} fields, generated ${count} advisories.`);
  } catch (error) {
    console.error("[Weather Cron Error]", error.message);
    jobRun.finishedAt = new Date();
    jobRun.status = "failed";
    jobRun.error = error.message;
    await jobRun.save();
  } finally {
    isRunning = false;
  }
};

const initScheduledJobs = () => {
  // Run weather scanner every 6 hours (configurable)
  const schedule = process.env.WEATHER_CHECK_CRON || "0 */6 * * *";
  cron.schedule(schedule, () => {
    console.log("[Cron] Triggering Scheduled Weather & Irrigation Check...");
    runWeatherCheck();
  });
};

module.exports = {
  initScheduledJobs,
  runWeatherCheck,
};
