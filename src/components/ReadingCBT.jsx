import React, { useEffect, useState } from "react";
import passagesData from "../data/reading_passages.json";
import { calculateBands } from "../utils/scoring.js";
import { generateFeedback } from "../utils/feedback.js";
import ResultCard from "./ResultCard.jsx";
import { APP_NAME, POWERED_BY } from "../config.js";

export default function ReadingCBT() {
  const [started, setStarted] = useState(false);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);

  const handleStart = () => {
    if (!name || !whatsapp) {
      alert("Please enter your name and WhatsApp number to begin.");
      return;
    }
    setStarted(true);
  };

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

  const handleChange = (qid, option) => {
    setAnswers({ ...answers, [qid]: option });
  };

  const handleSubmit = () => {
    let correct = 0;
    let total = 0;
    const weakAreas = {};

    passagesData.passages.forEach((p) => {
      p.questions.forEach((q) => {
        total++;
        if (answers[q.id] === q.answer) correct++;
        else weakAreas[q.skill] = (weakAreas[q.skill] || 0) + 1;
      });
    });

    const { readingBand, overall } = calculateBands(correct);
    const weaknesses = Object.keys(weakAreas);
    const feedback = generateFeedback(weaknesses);

    const resultData = {
      name,
      whatsapp,
      correct,
      total,
      readingBand,
      overall,
      weaknesses,
      feedback,
    };
    setResult(resultData);
    setFinished(true);

    // Save to localStorage for admin
    const existing = JSON.parse(localStorage.getItem("eac_results") || "[]");
    localStorage.setItem("eac_results", JSON.stringify([...existing, resultData]));
  };

  if (!started)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
        <h1 className="text-3xl font-bold text-blue-700 mb-2 text-center">{APP_NAME}</h1>
        <p className="text-gray-600 mb-4">{POWERED_BY}</p>
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
            Start Assessment
          </button>
        </div>
      </div>
    );

  if (finished) return <ResultCard result={result} />;

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <h2 className="text-xl font-semibold text-blue-700">{APP_NAME}</h2>
        <div className="text-gray-700 font-mono">⏱ {formatTime(timeLeft)}</div>
      </div>

      {passagesData.passages.map((p) => (
        <div key={p.id} className="mb-8 border-b pb-6">
          <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
          <p className="text-gray-700 mb-4 whitespace-pre-line">{p.text}</p>

          {p.questions.map((q) => (
            <div key={q.id} className="mb-3">
              <p className="font-medium">{q.id}. {q.question}</p>
              {q.options.map((opt) => (
                <label key={opt} className="block ml-4">
                  <input
                    type="radio"
                    name={`q${q.id}`}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => handleChange(q.id, opt)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
      >
        Submit
      </button>
    </div>
  );
}
