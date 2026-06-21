import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PreviewResult } from './PreviewResult';

describe('PreviewResult', () => {
  const defaultProps = {
    translatedContent: '# Translated Title\n\nThis is translated content.',
    fileName: 'README.md',
    targetLanguage: 'English',
    onDownload: () => {},
  };

  it('should render translated content preview', () => {
    render(<PreviewResult {...defaultProps} />);

    expect(screen.getByText(/Translated Title/)).toBeInTheDocument();
    expect(screen.getByText(/This is translated content/)).toBeInTheDocument();
  });

  it('should render download button', () => {
    render(<PreviewResult {...defaultProps} />);

    expect(screen.getByRole('button', { name: /下载/i })).toBeInTheDocument();
  });

  it('should render install GitHub App CTA', () => {
    render(<PreviewResult {...defaultProps} />);

    expect(screen.getByText(/安装 GitHub App 后提交 PR/)).toBeInTheDocument();
  });

  it('should render file name and target language', () => {
    render(<PreviewResult {...defaultProps} />);

    expect(screen.getByText(/README.md/)).toBeInTheDocument();
    expect(screen.getByText(/English/)).toBeInTheDocument();
  });

  it('should call onDownload when download button is clicked', () => {
    let downloadCalled = false;
    const onDownload = () => { downloadCalled = true; };

    render(<PreviewResult {...defaultProps} onDownload={onDownload} />);

    const downloadButton = screen.getByRole('button', { name: /下载/i });
    downloadButton.click();

    expect(downloadCalled).toBe(true);
  });
});
