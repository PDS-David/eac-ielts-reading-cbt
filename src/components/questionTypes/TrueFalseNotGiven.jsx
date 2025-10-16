import React from "react";

export default function TrueFalseNotGiven({ q, answers, onChange }) {
  const options = ["TRUE", "FALSE", "NOT GIVEN"];
  return (
    <div className="mb-4">
      <p className="font-medium mb-1">{q.id}. {q.question}</p>
      {options.map((opt) => (
        <label key={opt} className="block ml-4">
          <input
            type="radio"
            name={`q${q.id}`}
            value={opt}
            checked={answers[q.id] === opt}
            onChange={() => onChange(q.id, opt)}
            className="mr-2"
          />
          {opt}
        </label>
      ))}
    </div>
  );
}
