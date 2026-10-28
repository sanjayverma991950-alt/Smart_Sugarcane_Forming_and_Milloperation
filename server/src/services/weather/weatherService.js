const axios = require("axios");

// Simple in-memory cache to respect API quotas and rate limits
const weatherCache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

const WMO_CODES = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
};

/**
 * Fetch forecast from Open-Meteo
 */
const getForecastByCoords = async (latitude, longitude) => {
  const lat = Number(Number(latitude || 29.47).toFixed(2));
  const lon = Number(Number(longitude || 77.70).toFixed(2));
  const cacheKey = `${lat}_${lon}`;

  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const url = "https://api.open-meteo.com/v1/forecast";
    const res = await axios.get(url, {
      params: {
        latitude: lat,
        longitude: lon,
        current: "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m",
        daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum",
        timezone: "auto",
      },
      timeout: 8000,
    });

    const current = res.data.current || {};
    const daily = res.data.daily || {};

    const temp = current.temperature_2m ?? 28;
    const rainMm = current.precipitation ?? 0;
    const windSpeed = current.wind_speed_10m ?? 8;
    const weatherCode = current.weather_code ?? 0;
    const desc = WMO_CODES[weatherCode] || "Clear";

    // Analyze alerts and irrigation suggestions
    let alertType = "normal";
    let severity = "info";
    let adviceEn = "Weather conditions are normal. Carry out scheduled furrow irrigation.";
    let adviceHi = "मौसम सामान्य है। निर्धारित कार्यक्रम के अनुसार सिंचाई करें।";
    const suggestedActions = ["Maintain standard weeding and earthing up."];

    const todayRainSum = daily.precipitation_sum?.[0] || 0;

    if (todayRainSum > 30 || rainMm > 15) {
      alertType = "heavy_rain";
      severity = "warning";
      adviceEn = `Heavy rainfall predicted (~${todayRainSum.toFixed(1)} mm). Postpone all irrigation and nitrogen top-dressing to prevent leaching.`;
      adviceHi = `भारी बारिश की संभावना (~${todayRainSum.toFixed(1)} मिमी)। सिंचाई और यूरिया छिड़काव स्थगित रखें ताकि जलभराव न हो।`;
      suggestedActions.unshift("Ensure clear drainage channels around sugarcane fields.");
    } else if (temp > 40) {
      alertType = "heatwave";
      severity = "warning";
      adviceEn = `High temperature alert (${temp}°C). Irrigate lightly during early morning or late evening to protect cane moisture.`;
      adviceHi = `तेज धूप व गर्मी (${temp}°C)। फसल को सूखने से बचाने के लिए सुबह या शाम के समय हल्की सिंचाई करें।`;
      suggestedActions.unshift("Apply trash mulching to retain soil moisture.");
    } else if (temp < 6) {
      alertType = "frost";
      severity = "warning";
      adviceEn = "Low temperature/frost alert. Provide light irrigation to maintain soil warmth.";
      adviceHi = "पाला/शीतलहर की चेतावनी। खेत में हल्की सिंचाई कर तापमान बनाए रखें।";
    }

    const payload = {
      latitude: lat,
      longitude: lon,
      temperature: temp,
      humidity: current.relative_humidity_2m ?? 60,
      rainMm,
      windSpeedKmh: windSpeed,
      weatherCode,
      description: desc,
      alertType,
      severity,
      adviceEn,
      adviceHi,
      suggestedActions,
      dailyForecast: (daily.time || []).map((date, idx) => ({
        date,
        maxTemp: daily.temperature_2m_max?.[idx],
        minTemp: daily.temperature_2m_min?.[idx],
        rainSumMm: daily.precipitation_sum?.[idx],
        weather: WMO_CODES[daily.weather_code?.[idx]] || "Clear",
      })),
      timestamp: new Date().toISOString(),
    };

    weatherCache.set(cacheKey, { timestamp: Date.now(), data: payload });
    return payload;
  } catch (error) {
    console.error("[Weather Service Error]", error.message);
    // Return graceful fallback without crashing
    return {
      latitude: lat,
      longitude: lon,
      temperature: 28,
      humidity: 55,
      rainMm: 0,
      windSpeedKmh: 10,
      weatherCode: 0,
      description: "Clear (Offline estimate)",
      alertType: "normal",
      severity: "info",
      adviceEn: "Weather service unavailable temporarily. Follow seasonal irrigation recommendations.",
      adviceHi: "मौसम सेवा अस्थायी रूप से अनुपलब्ध है। मौसमी सिंचाई नियमों का पालन करें।",
      suggestedActions: ["Maintain routine irrigation cycle."],
      dailyForecast: [],
      timestamp: new Date().toISOString(),
    };
  }
};

module.exports = {
  getForecastByCoords,
};
