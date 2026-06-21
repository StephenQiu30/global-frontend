import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PreviewPage } from './PreviewPage';

describe('PreviewPage', () => {
  it('should render page title "公开仓库翻译预览"', () => {
    render(<PreviewPage />);

    expect(screen.getByText('公开仓库翻译预览')).toBeInTheDocument();
  });

  it('should render read-only notice "预览不会写入任何 GitHub 仓库。"', () => {
    render(<PreviewPage />);

    expect(screen.getByText(/预览不会写入任何 GitHub 仓库/)).toBeInTheDocument();
  });

  it('should render repository URL input', () => {
    render(<PreviewPage />);

    expect(screen.getByLabelText(/仓库 URL/i) || screen.getByPlaceholderText(/github/i)).toBeDefined();
  });

  it('should render language selector', () => {
    render(<PreviewPage />);

    expect(screen.getByLabelText(/目标语言/i) || screen.getByRole('combobox')).toBeDefined();
  });
});
