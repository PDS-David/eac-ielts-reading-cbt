// IELTS Academic Reading Band Conversion (based on 40 questions)
const bandMap = [
  { min: 39, max: 40, band: 9.0 },
  { min: 37, max: 38, band: 8.5 },
  { min: 35, max: 36, band: 8.0 },
  { min: 33, max: 34, band: 7.5 },
  { min: 30, max: 32, band: 7.0 },
  { min: 27, max: 29, band: 6.5 },
  { min: 23, max: 26, band: 6.0 },
  { min: 19, max: 22, band: 5.5 },
  { min: 15, max: 18, band: 5.0 },
  { min: 13, max: 14, band: 4.5 },
  { min: 10, max: 12, band: 4.0 },
  { min: 8,  max: 9,  band: 3.5 },
  { min: 6,  max: 7,  band: 3.0 },
  { min: 0,  max: 5,  band: 2.5 }
];

export function calculateBands(score) {
  let readingBand = 0;
  for (const range of bandMap) {
    if (score >= range.min && score <= range.max) {
      readingBand = range.band;
      break;
    }
  }
  // For now, estimated overall band = reading band (since this is Reading-only)
  const overall = readingBand;
  return { readingBand, overall };
}
