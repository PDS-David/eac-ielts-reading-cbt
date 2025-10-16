import React, { useEffect, useState } from "react";
import data from "../data/reading_passages_v2.json";
import { getFeedback } from "../utils/feedback";
import ResultCard from "./ResultCard.jsx";

export default function ReadingCBTv2() {
  const [started, setStarted] = useState(false);
  const [currentPassage, setCurrentPassage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [finished, setFinished] = useState(false);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [result, setResult] = useState(null);

  // ⏱ Timer logic
  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleAnswer = (qid, value) => {
    setAnswers({ ...answers, [qid]: value });
  };

  const handleStart = () => {
    if (!name || !whatsapp) {
      alert("Please enter your name and WhatsApp number");
      return;
    }

    // ✅ Auto-clean WhatsApp number before proceeding
    const cleaned = whatsapp.replace(/[^0-9]/g, "");
    if (cleaned.length < 8) {
      alert("Please enter a valid WhatsApp number (e.g. 2348012345678)");
      return;
    }

    setWhatsapp(cleaned);
    setStarted(true);
  };

  const handleNext = () => {
    if (currentPassage < data.passages.length - 1)
      setCurrentPassage(currentPassage + 1);
  };

  const handlePrev = () => {
    if (currentPassage > 0) setCurrentPassage(currentPassage - 1);
  };

  const handleSubmit = () => {
    let correct = 0;
    let total = 0;
    const sectionScores = {
      trueFalseNotGiven: { correct: 0, total: 0 },
      multipleChoice: { correct: 0, total: 0 },
      gapFill: { correct: 0, total: 0 },
      matching: { correct: 0, total: 0 },
    };

    data.passages.forEach((p) => {
      p.questions.forEach((q) => {
        total++;
        const ans = answers[q.id];

        const isCorrect =
          typeof ans === "string" &&
          ans.trim().toLowerCase() === q.answer.trim().toLowerCase();

        if (isCorrect) {
          correct++;
          if (sectionScores[q.type]) sectionScores[q.type].correct++;
        }
        if (sectionScores[q.type]) sectionScores[q.type].total++;
      });
    });

    const { readingBand, estimatedOverallBand, advice } = getFeedback(correct);

    const sectionPercentages = {};
    Object.keys(sectionScores).forEach((type) => {
      const { correct, total } = sectionScores[type];
      sectionPercentages[type] = total
        ? Math.round((correct / total) * 100)
        : 0;
    });

    const resultData = {
      candidate: name,
      phone: whatsapp.replace(/[^0-9]/g, ""), // remove + and all non-digits
      totalScore: correct,
      readingBand,
      estimatedOverallBand,
      sectionScores: {
        trueFalseNotGiven: sectionPercentages.trueFalseNotGiven || 0,
        multipleChoice: sectionPercentages.multipleChoice || 0,
        gapFill: sectionPercentages.gapFill || 0,
        matching: sectionPercentages.matching || 0,
      },
      advice,
    };

    setResult(resultData);
    setFinished(true);

    const existing = JSON.parse(localStorage.getItem("eac_results") || "[]");
    localStorage.setItem(
      "eac_results",
      JSON.stringify([...existing, resultData])
    );
  };

  // 🖥 UI
  if (!started)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
        <h1 className="text-3xl font-bold text-blue-700 mb-2 text-center">
          Educational Advancement Centre IELTS Diagnostic Reading CBT
        </h1>
        <p className="text-gray-600 mb-4">
          Powered by Pronoia Digital Services
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md w-80">
          <input
            className="w-full p-2 border rounded mb-3"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full p-2 border rounded mb-4"
            placeholder="WhatsApp Number (e.g. +2348012345678)"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
          <button
            onClick={handleStart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Start Test
          </button>
        </div>
      </div>
    );

  // ✅ Pass both name & cleaned phone to ResultCard
  if (finished)
    return (
      <ResultCard
        candidate={name}
        phone={whatsapp}
        results={result}
      />
    );

  const passage = data.passages[currentPassage];

  return (
    <div className="grid md:grid-cols-2 min-h-screen bg-white">
      {/* Left: Passage */}
      <div className="p-6 border-r overflow-y-auto max-h-screen">
        <div className="flex justify-between mb-3">
          <h2 className="text-lg font-semibold text-blue-700">
            {passage.title}
          </h2>
          <span className="font-mono text-gray-700">
            ⏱ {formatTime(timeLeft)}
          </span>
        </div>
        <p className="text-gray-700 whitespace-pre-line">{passage.text}</p>
      </div>

      {/* Right: Questions */}
      <div className="p-6 overflow-y-auto max-h-screen">
        {passage.questions.map((q) => (
          <div key={q.id} className="mb-4">
            <p className="font-medium text-gray-700">
              {q.id}. {q.question}
            </p>
            {q.options ? (
              q.options.map((opt, i) => (
                <label key={i} className="block">
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => handleAnswer(q.id, opt)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))
            ) : (
              <input
                type="text"
                className="border p-2 rounded w-full mt-1"
                placeholder="Type your answer"
                onChange={(e) => handleAnswer(q.id, e.target.value)}
              />
            )}
          </div>
        ))}

        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrev}
            disabled={currentPassage === 0}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
          >
            ← Previous
          </button>
          {currentPassage < data.passages.length - 1 ? (
            <button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
