const Field = require("../../models/Field");
const Delivery = require("../../models/Delivery");
const SupplyForecast = require("../../models/SupplyForecast");
const CrushingSeason = require("../../models/CrushingSeason");

/**
 * Generate statistical sugarcane supply forecast for a season
 */
const generateSeasonForecast = async (seasonId, adminId) => {
  const season = await CrushingSeason.findById(seasonId);
  if (!season) {
    throw new Error("Crushing season not found");
  }

  // Active fields
  const fields = await Field.find({ status: "active" });
  const totalFields = fields.length;

  let totalAcres = 0;
  let estimatedTotalTonnes = 0;

  fields.forEach((f) => {
    const acres = f.areaUnit === "hectare" ? f.area * 2.47105 : f.area;
    totalAcres += acres;

    // Variety & Crop cycle base yield estimate:
    // Plant crop: ~34 tonnes/acre, Ratoon crop: ~28 tonnes/acre
    const baseYieldPerAcre = f.cropType === "ratoon" ? 28 : 34;
    const estimatedTonnes = acres * baseYieldPerAcre;
    estimatedTotalTonnes += estimatedTonnes;
  });

  // Verified actual deliveries so far for this season
  const deliveries = await Delivery.find({ season: seasonId, status: "verified" });
  const actualQuantityTonnes = deliveries.reduce(
    (sum, d) => sum + (d.acceptedQuantityTonnes || 0),
    0
  );

  const warnings = [];
  if (totalFields < 3) {
    warnings.push("Very few field records registered. Forecast accuracy will increase as more farmers register their plots.");
  }
  if (deliveries.length === 0) {
    warnings.push("Crushing has not commenced or no verified deliveries recorded yet. Forecast is strictly pre-season estimate.");
  }

  // Predicted seasonal quantity
  const predictedQuantityTonnes = Number(Math.max(estimatedTotalTonnes, actualQuantityTonnes).toFixed(2));
  const lowerBoundTonnes = Number((predictedQuantityTonnes * 0.88).toFixed(2));
  const upperBoundTonnes = Number((predictedQuantityTonnes * 1.12).toFixed(2));

  const forecast = await SupplyForecast.create({
    season: season._id,
    periodType: "seasonal",
    forecastPeriodStart: season.tentativeStartDate,
    forecastPeriodEnd: season.expectedEndDate,
    predictedQuantityTonnes,
    lowerBoundTonnes,
    upperBoundTonnes,
    modelName: "AgroCane Yield & Trend Estimator v1.2",
    inputDataSummary: {
      totalRegisteredFields: totalFields,
      totalCultivatedAreaAcres: Number(totalAcres.toFixed(2)),
      historicalDeliveriesCount: deliveries.length,
      activeFarmersCount: new Set(fields.map((f) => f.farmer.toString())).size,
    },
    warnings,
    actualQuantityTonnes: Number(actualQuantityTonnes.toFixed(2)),
    generatedBy: adminId,
  });

  return forecast;
};

module.exports = {
  generateSeasonForecast,
};
