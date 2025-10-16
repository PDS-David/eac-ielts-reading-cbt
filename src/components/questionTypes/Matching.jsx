import React from "react";

export default function Matching({ q, answers, onChange }) {
  const leftItems = Object.keys(q.pairs);
  const rightItems = Object.values(q.pairs);

  return (
    <div className="mb-4">
      <p className="font-medium mb-2">{q.id}. {q.question}</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          {leftItems.map((item, i) => (
            <p key={i} className="text-sm py-1">{item}</p>
          ))}
        </div>
        <div>
          {leftItems.map((item, i) => (
            <select
              key={i}
              className="border p-1 text-sm w-full"
              value={answers[q.id]?.[item] || ""}
              onChange={(e) => {
                const newMatch = { ...(answers[q.id] || {}) };
                newMatch[item] = e.target.value;
                onChange(q.id, newMatch);
              }}
            >
              <option value="">Select</option>
              {rightItems.map((r, j) => (
                <option key={j} value={r}>{r}</option>
              ))}
            </select>
          ))}
        </div>
      </div>
    </div>
  );
}
