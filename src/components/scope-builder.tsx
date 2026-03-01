"use client";

import { useState } from "react";

interface ScopeBuilderProps {
  label: string;
  presets: string[];
  value: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

/**
 * A checkbox list with preset items (pre-checked) + ability to add/remove custom items.
 * Presets are shown first with checkboxes. Custom items can be added below.
 */
export default function ScopeBuilder({
  label,
  presets,
  value,
  onChange,
  placeholder = "Add custom item...",
}: ScopeBuilderProps) {
  const [newItem, setNewItem] = useState("");

  function togglePreset(item: string) {
    if (value.includes(item)) {
      onChange(value.filter((v) => v !== item));
    } else {
      onChange([...value, item]);
    }
  }

  function addCustom() {
    const trimmed = newItem.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
    setNewItem("");
  }

  function removeCustom(item: string) {
    onChange(value.filter((v) => v !== item));
  }

  // Items that are in value but NOT in presets = custom additions
  const customItems = value.filter((v) => !presets.includes(v));

  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-2">{label}</p>

      {/* Preset checkboxes */}
      <div className="space-y-2 mb-3">
        {presets.map((item) => (
          <label key={item} className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={value.includes(item)}
              onChange={() => togglePreset(item)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">
              {item}
            </span>
          </label>
        ))}
      </div>

      {/* Custom items */}
      {customItems.length > 0 && (
        <div className="space-y-1 mb-3">
          {customItems.map((item) => (
            <div key={item} className="flex items-center gap-2 pl-0">
              <input
                type="checkbox"
                checked
                onChange={() => removeCustom(item)}
                className="h-4 w-4 rounded border-gray-300 text-brand-600"
              />
              <span className="text-sm text-gray-700 flex-1">{item}</span>
              <button
                type="button"
                onClick={() => removeCustom(item)}
                className="text-gray-400 hover:text-red-500 text-xs"
                aria-label={`Remove ${item}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add custom item */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustom())}
          placeholder={placeholder}
          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={addCustom}
          disabled={!newItem.trim()}
          className="text-sm px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-40 transition-colors"
        >
          Add
        </button>
      </div>

      {value.length === 0 && (
        <p className="text-xs text-gray-400 mt-1">Check at least one item above.</p>
      )}
    </div>
  );
}
