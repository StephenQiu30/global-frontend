import { describe, it, expect } from "vitest";
import {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  isValidLanguageCode,
  getLanguageByCode,
} from "./languages";

describe("SUPPORTED_LANGUAGES", () => {
  it("contains exactly 8 languages", () => {
    expect(SUPPORTED_LANGUAGES).toHaveLength(8);
  });

  it("includes all required language codes", () => {
    const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
    expect(codes).toEqual([
      "zh-CN",
      "zh-TW",
      "en",
      "ja",
      "ko",
      "fr",
      "de",
      "es",
    ]);
  });

  it("each language has code and label", () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      expect(lang).toHaveProperty("code");
      expect(lang).toHaveProperty("label");
      expect(typeof lang.code).toBe("string");
      expect(typeof lang.label).toBe("string");
      expect(lang.code.length).toBeGreaterThan(0);
      expect(lang.label.length).toBeGreaterThan(0);
    }
  });
});

describe("DEFAULT_LANGUAGE", () => {
  it("defaults to zh-CN", () => {
    expect(DEFAULT_LANGUAGE).toBe("zh-CN");
  });

  it("is a valid supported language code", () => {
    const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
    expect(codes).toContain(DEFAULT_LANGUAGE);
  });
});

describe("isValidLanguageCode", () => {
  it("returns true for supported codes", () => {
    expect(isValidLanguageCode("zh-CN")).toBe(true);
    expect(isValidLanguageCode("ja")).toBe(true);
    expect(isValidLanguageCode("es")).toBe(true);
  });

  it("returns false for unsupported codes", () => {
    expect(isValidLanguageCode("xx")).toBe(false);
    expect(isValidLanguageCode("pt-BR")).toBe(false);
    expect(isValidLanguageCode("")).toBe(false);
  });
});

describe("getLanguageByCode", () => {
  it("returns the language object for a valid code", () => {
    const lang = getLanguageByCode("ja");
    expect(lang).toEqual({ code: "ja", label: "日本語" });
  });

  it("returns undefined for an invalid code", () => {
    expect(getLanguageByCode("xx")).toBeUndefined();
  });
});
