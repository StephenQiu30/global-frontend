import { describe, it, expect } from "vitest";
import { getTargetPath } from "./targetPath";

describe("getTargetPath", () => {
  it("appends language suffix before .md extension", () => {
    expect(getTargetPath("README.md", "zh-CN")).toBe("README.zh-CN.md");
  });

  it("appends language suffix before .markdown extension", () => {
    expect(getTargetPath("CHANGELOG.markdown", "zh-CN")).toBe(
      "CHANGELOG.zh-CN.markdown"
    );
  });

  it("handles nested directory paths", () => {
    expect(getTargetPath("docs/guide.md", "ja")).toBe("docs/guide.ja.md");
  });

  it("handles deeply nested paths", () => {
    expect(getTargetPath("src/docs/api/reference.md", "ko")).toBe(
      "src/docs/api/reference.ko.md"
    );
  });

  it("handles root-level README.markdown", () => {
    expect(getTargetPath("README.markdown", "zh-CN")).toBe(
      "README.zh-CN.markdown"
    );
  });

  it("preserves directory structure for nested files", () => {
    expect(getTargetPath("docs/sub/deep/file.md", "fr")).toBe(
      "docs/sub/deep/file.fr.md"
    );
  });
});
