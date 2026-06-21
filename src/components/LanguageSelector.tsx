"use client";

import { useState, useMemo } from "react";
import {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  isValidLanguageCode,
} from "@/lib/languages";

interface LanguageSelectorProps {
  value?: string;
  onChange?: (code: string) => void;
  getTargetPath?: (sourcePath: string, language: string) => string;
  sourcePath?: string;
}

export function LanguageSelector({
  value,
  onChange,
  getTargetPath,
  sourcePath,
}: LanguageSelectorProps) {
  const [search, setSearch] = useState("");

  const effectiveValue =
    value && isValidLanguageCode(value) ? value : DEFAULT_LANGUAGE;

  const filteredLanguages = useMemo(() => {
    if (!search.trim()) return SUPPORTED_LANGUAGES;
    const q = search.toLowerCase();
    return SUPPORTED_LANGUAGES.filter(
      (lang) =>
        lang.label.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q)
    );
  }, [search]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value;
    if (isValidLanguageCode(newCode)) {
      onChange?.(newCode);
    }
  };

  const targetPreview =
    getTargetPath && sourcePath ? getTargetPath(sourcePath, effectiveValue) : null;

  return (
    <div className="space-y-2">
      <label
        htmlFor="language-select"
        className="block text-sm font-medium text-gray-700"
      >
        目标语言
      </label>

      <input
        type="text"
        placeholder="搜索语言..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        aria-label="搜索语言"
      />

      <select
        id="language-select"
        aria-label="目标语言"
        value={effectiveValue}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {filteredLanguages.length === 0 ? (
          <option disabled value="">
            无匹配语言
          </option>
        ) : (
          filteredLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label} ({lang.code})
            </option>
          ))
        )}
      </select>

      {targetPreview && (
        <p className="text-sm text-gray-500">
          输出文件预览: <span className="font-mono">{targetPreview}</span>
        </p>
      )}
    </div>
  );
}
