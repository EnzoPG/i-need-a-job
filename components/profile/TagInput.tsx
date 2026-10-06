"use client";

import { useState } from "react";
import { X } from "lucide-react";

type Props = {
  label: string;
  tags: string[];
  placeholder?: string;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  emptyMessage?: string;
};

export function TagInput({
  label,
  tags,
  placeholder = "Add a tag",
  onAddTag,
  onRemoveTag,
  emptyMessage,
}: Props) {
  const [inputVal, setInputVal] = useState("");

  const handleAdd = () => {
    const trimmed = inputVal.trim();
    if (trimmed) {
      onAddTag(trimmed);
      setInputVal("");
    }
  };

  return (
    <div>
      <label className="block text-[11px] font-semibold tracking-wider text-text-secondary uppercase mb-1.5">
        {label}
      </label>
      <div className="flex gap-2 mb-2.5">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder={placeholder}
          className="flex-1 bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="bg-surface hover:bg-surface-secondary border border-border text-text-primary text-xs font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-surface-secondary border border-border text-text-primary text-xs font-medium px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs"
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemoveTag(tag)}
              className="text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              aria-label={`Remove ${tag}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        {tags.length === 0 && emptyMessage && (
          <span className="text-xs text-text-muted italic py-1">
            {emptyMessage}
          </span>
        )}
      </div>
    </div>
  );
}
