import React from "react";
import { getFeedback } from "../utils/feedback";

export default function ResultCard({ candidate, phone, results }) {
  const {
    totalScore,
    readingBand,
    estimatedOverallBand,
    sectionScores,
    advice,
  } = results;

  // Create formatted WhatsApp message
  const message = `
📘 *Educational Advancement Centre IELTS Reading Diagnostic Result*
(Powered by *Pronoia Digital Services*)

👤 *Candidate:* ${candidate}
📖 *Reading Score:* ${totalScore}/36
⭐ *Reading Band:* ${readingBand}
🎯 *Estimated Overall Band:* ${estimatedOverallBand}

📊 *Section Performance*
• True/False/Not Given: ${sectionScores.trueFalseNotGiven}%
• Multiple Choice: ${sectionScores.multipleChoice}%
• Gap Fill: ${sectionScores.gapFill}%
• Matching: ${sectionScores.matching}%

💡 *Advice:* ${advice}

© Pronoia Digital Services | +234 810 755 1000
`;

  // ✅ FIXED WhatsApp handler
  const sendWhatsApp = () => {
    if (!phone) {
      alert("Please enter your WhatsApp number.");
      return;
    }

    // Strip +, spaces, or any non-numeric character
    const cleaned = phone.toString().replace(/[^0-9]/g, "");

    if (!cleaned || cleaned.length < 8) {
      alert("Invalid WhatsApp number. Use full format like 2348012345678");
      return;
    }

    const encoded = encodeURIComponent(message.trim());
    const whatsappURL = `https://wa.me/${cleaned}?text=${encoded}`;
    console.log("✅ Opening:", whatsappURL); // debug line
    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-blue-700">
        Assessment Complete
      </h2>
      <p className="mt-2 text-center">
        {candidate}, here are your results:
      </p>

      <div className="mt-4 text-gray-800 text-center">
        <p>📖 Reading Score: {totalScore}/36</p>
        <p>⭐ Reading Band: {readingBand}</p>
        <p>🎯 Estimated Overall Band: {estimatedOverallBand}</p>
      </div>

      <div className="mt-4 text-left">
        <h3 className="font-semibold text-blue-700">📊 Section Performance</h3>
        <ul className="list-disc ml-6">
          <li>True/False/Not Given: {sectionScores.trueFalseNotGiven}%</li>
          <li>Multiple Choice: {sectionScores.multipleChoice}%</li>
          <li>Gap Fill: {sectionScores.gapFill}%</li>
          <li>Matching: {sectionScores.matching}%</li>
        </ul>
      </div>

      <button
        onClick={sendWhatsApp}
        className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
      >
        📤 Send Result via WhatsApp
      </button>
    </div>
  );
}
