import React, { useEffect } from "react";

export interface MarkdownFile {
  path: string;
  size_bytes: number;
  is_default_readme: boolean;
  disabled_reason: string | null;
  target_path_preview: string;
  target_exists: boolean;
}

export interface MarkdownFilePickerProps {
  files: MarkdownFile[];
  selectedPaths: string[];
  onSelectionChange: (paths: string[]) => void;
  maxFiles?: number;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function computeTotalSize(files: MarkdownFile[], selectedPaths: string[]): number {
  return files
    .filter((f) => selectedPaths.includes(f.path))
    .reduce((sum, f) => sum + f.size_bytes, 0);
}

export function MarkdownFilePicker({
  files,
  selectedPaths,
  onSelectionChange,
  maxFiles = 10,
}: MarkdownFilePickerProps) {
  // Auto-select default README on mount when no selection exists
  useEffect(() => {
    if (selectedPaths.length === 0) {
      const readme = files.find((f) => f.is_default_readme);
      if (readme) {
        onSelectionChange([readme.path]);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const atLimit = selectedPaths.length >= maxFiles;

  function toggle(path: string) {
    if (selectedPaths.includes(path)) {
      onSelectionChange(selectedPaths.filter((p) => p !== path));
    } else {
      onSelectionChange([...selectedPaths, path]);
    }
  }

  function isDisabled(file: MarkdownFile): boolean {
    if (file.disabled_reason !== null) return true;
    if (atLimit && !selectedPaths.includes(file.path)) return true;
    return false;
  }

  const totalSize = computeTotalSize(files, selectedPaths);

  return (
    <div>
      <div data-testid="selection-summary">
        {selectedPaths.length} file{selectedPaths.length !== 1 ? "s" : ""}{" "}
        selected · {formatSize(totalSize)}
      </div>
      <ul>
        {files.map((file) => {
          const disabled = isDisabled(file);
          const checked = selectedPaths.includes(file.path);
          return (
            <li key={file.path}>
              <label>
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => toggle(file.path)}
                />
                <span>{file.path}</span>
                <span>{formatSize(file.size_bytes)}</span>
                <span>→ {file.target_path_preview}</span>
                {file.disabled_reason && (
                  <span data-testid="disabled-reason">
                    {file.disabled_reason}
                  </span>
                )}
                {file.target_exists && (
                  <span data-testid="target-exists-warning">
                    Target file already exists
                  </span>
                )}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
