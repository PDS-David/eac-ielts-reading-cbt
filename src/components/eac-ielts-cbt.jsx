import React, { useState } from "react";
import readingData from "../data/reading_passages_v2.json";

export default function EACIELTSCBT() {
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [candidateName, setCandidateName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [results, setResults] = useState(null);

  const currentPassage = readingData.passages[currentPassageIndex];

  const handleAnswer = (qId, value) => {
    setAnswers({ ...answers, [qId]: value });
  };

  const handleNext = () => {
    if (currentPassageIndex < readingData.passages.length - 1) {
      setCurrentPassageIndex(currentPassageIndex + 1);
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    let correct = 0;
    readingData.passages.forEach((p) => {
      p.questions.forEach((q) => {
        if (answers[q.id]?.toString().trim().toLowerCase() === q.answer?.toString().trim().toLowerCase()) {
          correct++;
        }
      });
    });
    const total = readingData.passages.reduce((sum, p) => sum + p.questions.length, 0);

    const readingBand = computeBand(correct, total);
    const listeningBand = readingBand >= 7 ? readingBand + 0.5 : readingBand - 0.5;
    const writingBand = readingBand - 0.5;
    const speakingBand = readingBand >= 7 ? readingBand : readingBand - 0.5;
    const overallBand = Math.round(((readingBand + listeningBand + writingBand + speakingBand) / 4) * 2) / 2;

    const descriptor =
      readingBand >= 8
        ? "Very good user – handles complex argumentation well."
        : readingBand >= 7
        ? "Good user – operational command with occasional errors."
        : readingBand >= 6
        ? "Competent user – understands general meaning, needs precision practice."
        : "Modest user – basic comprehension; needs more exposure.";

    setResults({
      correct,
      total,
      readingBand,
      listeningBand,
      writingBand,
      speakingBand,
      overallBand,
      descriptor,
    });
    setSubmitted(true);
  };

  const computeBand = (correct, total) => {
    const pct = (correct / total) * 100;
    if (pct >= 90) return 9;
    if (pct >= 80) return 8;
    if (pct >= 70) return 7;
    if (pct >= 60) return 6;
    if (pct >= 50) return 5;
    if (pct >= 40) return 4;
    return 3;
  };

  const generateWhatsAppMessage = () => {
    if (!results) return "";
    const msg = `
🎓 *Educational Advancement Centre - IELTS Diagnostic Reading Assessment*
_Powered by Pronoia Digital Services_

👤 Candidate: ${candidateName}
📆 Date: ${new Date().toLocaleDateString()}

📘 *Reading Result*
Correct: ${results.correct}/${results.total}
Reading Band: *${results.readingBand}*

📊 *Predicted Performance*
🎧 Listening: Band ${results.listeningBand}
📖 Reading: Band ${results.readingBand}
✍️ Writing: Band ${results.writingBand}
🗣️ Speaking: Band ${results.speakingBand}
⭐ *Estimated Overall Band:* ${results.overallBand}

🧠 Feedback:
${results.descriptor}

━━━━━━━━━━━━━━━━━━━━━━
© Pronoia Digital Services | Educational Advancement Centre
📞 +234 810 755 1000
    `;
    return encodeURIComponent(msg).replace(/%0A/g, "\n").replace(/%20/g, " ");
  };

  const sendWhatsApp = () => {
    const msg = generateWhatsAppMessage();
    const link = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${msg}`;
    window.open(link, "_blank");
  };

  if (submitted) {
    return (
      <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-blue-800 mb-3 text-center">
          🎓 IELTS Reading Result Summary
        </h2>
        <p className="text-center text-gray-600 mb-4">Candidate: {candidateName}</p>
        <div className="border rounded p-4 bg-gray-50 text-gray-800 mb-4">
          <p><b>Correct Answers:</b> {results.correct}/{results.total}</p>
          <p><b>Reading Band:</b> {results.readingBand}</p>
          <p><b>Listening:</b> {results.listeningBand}</p>
          <p><b>Writing:</b> {results.writingBand}</p>
          <p><b>Speaking:</b> {results.speakingBand}</p>
          <p><b>Estimated Overall Band:</b> {results.overallBand}</p>
          <p className="mt-3"><b>Feedback:</b> {results.descriptor}</p>
        </div>
        <div className="flex flex-col items-center space-y-3">
          <button
            onClick={sendWhatsApp}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow"
          >
            Send Result to WhatsApp
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg shadow"
          >
            Restart Test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 mb-4 text-center">
        Educational Advancement Centre - IELTS Reading Diagnostic CBT
      </h1>

      {!submitted && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Candidate Name"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            className="border p-2 rounded w-full mb-3"
          />
          <input
            type="text"
            placeholder="WhatsApp Number (e.g. 2348012345678)"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
      )}

      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">
          {currentPassage.title}
        </h2>
        <p className="text-gray-800 mb-4 whitespace-pre-line">{currentPassage.text}</p>

        {currentPassage.questions.map((q) => (
          <div key={q.id} className="mb-4">
            <p className="font-medium text-gray-700">{q.id}. {q.question}</p>
            {q.options ? (
              q.options.map((opt, idx) => (
                <label key={idx} className="block">
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value={opt}
                    onChange={() => handleAnswer(q.id, opt)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))
            ) : (
              <input
                type="text"
                placeholder="Type your answer"
                className="border p-2 rounded w-full mt-2"
                onChange={(e) => handleAnswer(q.id, e.target.value)}
              />
            )}
          </div>
        ))}

        <button
          onClick={handleNext}
          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg shadow mt-4"
        >
          {currentPassageIndex < readingData.passages.length - 1 ? "Next Passage →" : "Submit Test"}
        </button>
      </div>
    </div>
  );
}
