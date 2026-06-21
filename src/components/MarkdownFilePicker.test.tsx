import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MarkdownFilePicker, MarkdownFile } from "./MarkdownFilePicker";

const makeFile = (overrides: Partial<MarkdownFile> = {}): MarkdownFile => ({
  path: "README.md",
  size_bytes: 1024,
  is_default_readme: false,
  disabled_reason: null,
  target_path_preview: "README.zh-CN.md",
  target_exists: false,
  ...overrides,
});

describe("MarkdownFilePicker", () => {
  it("renders a checkbox for each file", () => {
    const files = [
      makeFile({ path: "README.md" }),
      makeFile({ path: "docs/guide.md" }),
      makeFile({ path: "CHANGELOG.md" }),
    ];
    render(
      <MarkdownFilePicker
        files={files}
        selectedPaths={[]}
        onSelectionChange={() => {}}
      />
    );
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(3);
  });

  it("displays file path and size for each file", () => {
    const files = [makeFile({ path: "README.md", size_bytes: 2048 })];
    render(
      <MarkdownFilePicker
        files={files}
        selectedPaths={[]}
        onSelectionChange={() => {}}
      />
    );
    expect(screen.getByText("README.md")).toBeDefined();
    expect(screen.getByText("2 KB")).toBeDefined();
  });

  it("displays target path preview", () => {
    const files = [
      makeFile({
        path: "README.md",
        target_path_preview: "README.zh-CN.md",
      }),
    ];
    render(
      <MarkdownFilePicker
        files={files}
        selectedPaths={[]}
        onSelectionChange={() => {}}
      />
    );
    expect(screen.getByText((content) => content.includes("README.zh-CN.md"))).toBeDefined();
  });

  it("auto-selects file with is_default_readme when selectedPaths is empty", () => {
    const files = [
      makeFile({ path: "README.md", is_default_readme: true }),
      makeFile({ path: "docs/guide.md", is_default_readme: false }),
    ];
    const onSelectionChange = vi.fn();
    render(
      <MarkdownFilePicker
        files={files}
        selectedPaths={[]}
        onSelectionChange={onSelectionChange}
      />
    );
    // The component should call onSelectionChange with README.md selected
    expect(onSelectionChange).toHaveBeenCalledWith(["README.md"]);
  });

  it("reflects selectedPaths in checkbox state", () => {
    const files = [
      makeFile({ path: "README.md" }),
      makeFile({ path: "docs/guide.md" }),
    ];
    render(
      <MarkdownFilePicker
        files={files}
        selectedPaths={["README.md"]}
        onSelectionChange={() => {}}
      />
    );
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it("calls onSelectionChange when a file is toggled", async () => {
    const user = userEvent.setup();
    const files = [
      makeFile({ path: "README.md" }),
      makeFile({ path: "docs/guide.md" }),
    ];
    const onSelectionChange = vi.fn();
    render(
      <MarkdownFilePicker
        files={files}
        selectedPaths={["README.md"]}
        onSelectionChange={onSelectionChange}
      />
    );
    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[1]);
    expect(onSelectionChange).toHaveBeenCalledWith(["README.md", "docs/guide.md"]);
  });

  it("deselects a file when its checkbox is clicked while selected", async () => {
    const user = userEvent.setup();
    const files = [
      makeFile({ path: "README.md" }),
      makeFile({ path: "docs/guide.md" }),
    ];
    const onSelectionChange = vi.fn();
    render(
      <MarkdownFilePicker
        files={files}
        selectedPaths={["README.md", "docs/guide.md"]}
        onSelectionChange={onSelectionChange}
      />
    );
    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);
    expect(onSelectionChange).toHaveBeenCalledWith(["docs/guide.md"]);
  });

  it("disables checkbox when disabled_reason is set", () => {
    const files = [
      makeFile({
        path: "huge.md",
        disabled_reason: "File exceeds 200KB limit",
      }),
    ];
    render(
      <MarkdownFilePicker
        files={files}
        selectedPaths={[]}
        onSelectionChange={() => {}}
      />
    );
    const checkbox = screen.getAllByRole("checkbox")[0];
    expect(checkbox).toBeDisabled();
    expect(screen.getByText("File exceeds 200KB limit")).toBeDefined();
  });

  it("disables unchecked files when maxFiles limit is reached", () => {
    const files = Array.from({ length: 12 }, (_, i) =>
      makeFile({ path: `file-${i}.md` })
    );
    const selectedPaths = Array.from({ length: 10 }, (_, i) => `file-${i}.md`);
    render(
      <MarkdownFilePicker
        files={files}
        selectedPaths={selectedPaths}
        onSelectionChange={() => {}}
        maxFiles={10}
      />
    );
    const checkboxes = screen.getAllByRole("checkbox");
    // First 10 should be enabled (they are selected)
    for (let i = 0; i < 10; i++) {
      expect(checkboxes[i]).toBeEnabled();
    }
    // Last 2 should be disabled (limit reached)
    for (let i = 10; i < 12; i++) {
      expect(checkboxes[i]).toBeDisabled();
    }
  });

  it("shows selection count and total size", () => {
    const files = [
      makeFile({ path: "README.md", size_bytes: 1024 }),
      makeFile({ path: "guide.md", size_bytes: 2048 }),
      makeFile({ path: "api.md", size_bytes: 4096 }),
    ];
    render(
      <MarkdownFilePicker
        files={files}
        selectedPaths={["README.md", "guide.md"]}
        onSelectionChange={() => {}}
      />
    );
    expect(screen.getByText(/2.*files selected/)).toBeDefined();
    expect(screen.getByText(/3 KB/)).toBeDefined();
  });

  it("shows 0 files selected when nothing is selected", () => {
    const files = [makeFile({ path: "README.md", size_bytes: 1024 })];
    render(
      <MarkdownFilePicker
        files={files}
        selectedPaths={[]}
        onSelectionChange={() => {}}
      />
    );
    expect(screen.getByText(/0.*files selected/)).toBeDefined();
  });

  it("shows target_exists warning without blocking selection", () => {
    const files = [
      makeFile({ path: "README.md", target_exists: true }),
    ];
    render(
      <MarkdownFilePicker
        files={files}
        selectedPaths={[]}
        onSelectionChange={() => {}}
      />
    );
    expect(screen.getByText(/already exists/i)).toBeDefined();
    const checkbox = screen.getAllByRole("checkbox")[0];
    expect(checkbox).toBeEnabled();
  });

  it("uses custom maxFiles prop", () => {
    const files = Array.from({ length: 6 }, (_, i) =>
      makeFile({ path: `file-${i}.md` })
    );
    const selectedPaths = Array.from({ length: 5 }, (_, i) => `file-${i}.md`);
    render(
      <MarkdownFilePicker
        files={files}
        selectedPaths={selectedPaths}
        onSelectionChange={() => {}}
        maxFiles={5}
      />
    );
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[5]).toBeDisabled();
  });
});
