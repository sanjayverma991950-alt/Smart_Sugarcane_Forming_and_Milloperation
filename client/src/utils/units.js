// Area units are always stored with the record (areaUnit), never guessed.
// 1 hectare = 2.47105 acres
const ACRES_PER_HECTARE = 2.47105;

export const toAcres = (value, unit) =>
  unit === "hectare" ? value * ACRES_PER_HECTARE : value;

export const toHectares = (value, unit) =>
  unit === "acre" ? value / ACRES_PER_HECTARE : value;

export const formatArea = (value, unit) =>
  `${Number(value).toFixed(2)} ${unit === "hectare" ? "ha" : "acres"}`;

// Sum a list of fields and return the total in both units
export const totalArea = (fields) => {
  const acres = fields.reduce((sum, f) => sum + toAcres(Number(f.area) || 0, f.areaUnit), 0);
  return { acres, hectares: acres / ACRES_PER_HECTARE };
};

export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

// <input type="date"> needs yyyy-mm-dd
export const toInputDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");
