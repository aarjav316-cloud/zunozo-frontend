import { useState } from "react";

const TagsInput = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = inputValue.trim().toLowerCase();
      if (tag && !value.includes(tag)) {
        onChange([...value, tag]);
        setInputValue("");
      }
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-300">
        Tags
        <span className="text-zinc-600 ml-2 text-xs">(Optional)</span>
      </label>
      <div className="flex flex-wrap gap-2 p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl min-h-[52px]">
        {value.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800 text-white text-sm rounded-full"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-rose-400"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? "Type and press Enter" : ""}
          className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-white placeholder-zinc-600"
        />
      </div>
      <p className="text-xs text-zinc-600">Press Enter or comma to add tags</p>
    </div>
  );
};

export default TagsInput;
