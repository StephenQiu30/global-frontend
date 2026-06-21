import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LanguageSelector } from "./LanguageSelector";

describe("LanguageSelector", () => {
  it("renders with label 目标语言", () => {
    render(<LanguageSelector />);
    expect(screen.getByLabelText(/目标语言/)).toBeInTheDocument();
  });

  it("defaults to zh-CN", () => {
    render(<LanguageSelector />);
    const select = screen.getByLabelText(/目标语言/) as HTMLSelectElement;
    expect(select.value).toBe("zh-CN");
  });

  it("displays all 8 supported languages as options", () => {
    render(<LanguageSelector />);
    const select = screen.getByLabelText(/目标语言/);
    const options = within(select).getAllByRole("option");
    expect(options).toHaveLength(8);
  });

  it("shows language label and code for each option", () => {
    render(<LanguageSelector />);
    const select = screen.getByLabelText(/目标语言/);
    const options = within(select).getAllByRole("option");
    expect(options[0]).toHaveTextContent(/简体中文/);
    expect(options[0]).toHaveTextContent(/zh-CN/);
  });

  it("calls onChange when user selects a different language", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<LanguageSelector onChange={onChange} />);

    const select = screen.getByLabelText(/目标语言/);
    await user.selectOptions(select, "ja");

    expect(onChange).toHaveBeenCalledWith("ja");
  });

  it("supports controlled value prop", () => {
    render(<LanguageSelector value="ko" onChange={vi.fn()} />);
    const select = screen.getByLabelText(/目标语言/) as HTMLSelectElement;
    expect(select.value).toBe("ko");
  });

  it("falls back to DEFAULT_LANGUAGE when value is invalid", () => {
    render(<LanguageSelector value="xx" onChange={vi.fn()} />);
    const select = screen.getByLabelText(/目标语言/) as HTMLSelectElement;
    expect(select.value).toBe("zh-CN");
  });

  it("renders target path preview when getTargetPath and sourcePath are provided", () => {
    const getTargetPath = (path: string, lang: string) =>
      path.replace(/(\.\w+)$/, `.${lang}$1`);
    render(
      <LanguageSelector
        value="ja"
        getTargetPath={getTargetPath}
        sourcePath="README.md"
      />
    );
    expect(screen.getByText(/README\.ja\.md/)).toBeInTheDocument();
  });

  it("filters language list when searching by label", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);

    const searchInput = screen.getByPlaceholderText(/搜索语言/);
    await user.type(searchInput, "日本");

    const select = screen.getByLabelText(/目标语言/);
    const options = within(select).getAllByRole("option");
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent(/日本語/);
  });

  it("filters language list when searching by code", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);

    const searchInput = screen.getByPlaceholderText(/搜索语言/);
    await user.type(searchInput, "zh");

    const select = screen.getByLabelText(/目标语言/);
    const options = within(select).getAllByRole("option");
    expect(options).toHaveLength(2); // zh-CN and zh-TW
  });

  it("shows 无匹配语言 when search has no results", async () => {
    const user = userEvent.setup();
    render(<LanguageSelector />);

    const searchInput = screen.getByPlaceholderText(/搜索语言/);
    await user.type(searchInput, "xyznonexistent");

    const select = screen.getByLabelText(/目标语言/);
    const options = within(select).getAllByRole("option");
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent(/无匹配语言/);
  });

  it("updates target path preview when language changes", async () => {
    const getTargetPath = (path: string, lang: string) =>
      path.replace(/(\.\w+)$/, `.${lang}$1`);
    const onChange = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <LanguageSelector
        value="zh-CN"
        onChange={onChange}
        getTargetPath={getTargetPath}
        sourcePath="README.md"
      />
    );

    expect(screen.getByText(/README\.zh-CN\.md/)).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/目标语言/), "ja");

    // Simulate parent updating the controlled value
    rerender(
      <LanguageSelector
        value="ja"
        onChange={onChange}
        getTargetPath={getTargetPath}
        sourcePath="README.md"
      />
    );

    expect(screen.getByText(/README\.ja\.md/)).toBeInTheDocument();
  });
});
