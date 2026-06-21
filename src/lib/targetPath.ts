/**
 * Compute the target path for a translated Markdown file.
 *
 * Convention: insert language suffix before the file extension.
 * e.g., README.md + zh-CN -> README.zh-CN.md
 */
export function getTargetPath(sourcePath: string, language: string): string {
  const lastDot = sourcePath.lastIndexOf(".");
  if (lastDot === -1) return `${sourcePath}.${language}`;
  return `${sourcePath.slice(0, lastDot)}.${language}${sourcePath.slice(lastDot)}`;
}
