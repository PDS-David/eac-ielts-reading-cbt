// Band prediction & feedback generator

export function getFeedback(score) {
  let readingBand = 0;
  if (score <= 5) readingBand = 2.5;
  else if (score <= 10) readingBand = 3.5;
  else if (score <= 15) readingBand = 4.5;
  else if (score <= 23) readingBand = 5.5;
  else if (score <= 30) readingBand = 6.5;
  else if (score <= 34) readingBand = 7.5;
  else if (score <= 36) readingBand = 8.5;

  // Estimate other skills and overall band (based on Excel mapping)
  const estimatedOverallBand = Math.round((readingBand + 0.5) * 10) / 10;

  let advice = "";
  if (readingBand < 4) advice = "You need to improve comprehension and focus.";
  else if (readingBand < 5.5)
    advice = "Develop scanning and paraphrasing techniques.";
  else if (readingBand < 7)
    advice = "You show good understanding but need precision.";
  else advice = "Excellent comprehension and time management!";

  return {
    readingBand,
    estimatedOverallBand,
    advice,
  };
}
