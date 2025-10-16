import React from "react";

export default function GapFill({ q, answers, onChange }) {
  return (
    <div className="mb-4">
      <p className="font-medium mb-1">{q.id}. {q.question}</p>
      <input
        type="text"
        className="ml-4 border-b border-gray-400 focus:outline-none focus:border-blue-600"
        value={answers[q.id] || ""}
        onChange={(e) => onChange(q.id, e.target.value.trim())}
        placeholder="Type your answer"
      />
    </div>
  );
}
