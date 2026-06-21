import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskResult } from './TaskResult';
import type { TaskResultData } from '@/lib/types';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const successResult: TaskResultData = {
  taskId: 'task-123',
  status: 'succeeded',
  repository: 'owner/repo',
  targetLanguage: 'zh-CN',
  selectedFiles: ['README.md'],
  prUrl: 'https://github.com/owner/repo/pull/42',
  prNumber: 42,
  fileMappings: [
    { source: 'README.md', target: 'README.zh-CN.md' },
  ],
};

const failedResult: TaskResultData = {
  taskId: 'task-456',
  status: 'failed',
  repository: 'owner/repo',
  targetLanguage: 'zh-CN',
  selectedFiles: ['README.md'],
  errorCode: 'translation_timeout',
  errorMessage: '翻译服务超时，请稍后重试',
  retryable: true,
};

describe('TaskResult', () => {
  describe('success state', () => {
    it('renders PR link with correct text', () => {
      render(<TaskResult result={successResult} />);

      const prLink = screen.getByRole('link', { name: /查看 Pull Request/i });
      expect(prLink).toBeInTheDocument();
      expect(prLink).toHaveAttribute('href', 'https://github.com/owner/repo/pull/42');
    });

    it('renders PR number', () => {
      render(<TaskResult result={successResult} />);

      expect(screen.getByText('PR #42')).toBeInTheDocument();
    });

    it('renders file mappings', () => {
      render(<TaskResult result={successResult} />);

      expect(screen.getByText(/README\.md/)).toBeInTheDocument();
      expect(screen.getByText(/README\.zh-CN\.md/)).toBeInTheDocument();
    });

    it('renders target language', () => {
      render(<TaskResult result={successResult} />);

      expect(screen.getByText('语言:', { exact: false })).toBeInTheDocument();
    });
  });

  describe('failure state', () => {
    it('renders error message', () => {
      render(<TaskResult result={failedResult} />);

      expect(screen.getByText('翻译服务超时，请稍后重试')).toBeInTheDocument();
    });

    it('renders retry button for retryable errors', () => {
      render(<TaskResult result={failedResult} />);

      const retryButton = screen.getByRole('button', { name: /返回修改/i });
      expect(retryButton).toBeInTheDocument();
    });

    it('navigates to /translate on retry button click', async () => {
      const user = userEvent.setup();
      render(<TaskResult result={failedResult} />);

      const retryButton = screen.getByRole('button', { name: /返回修改/i });
      await user.click(retryButton);

      expect(mockPush).toHaveBeenCalledWith('/translate');
    });

    it('does not render PR link', () => {
      render(<TaskResult result={failedResult} />);

      expect(screen.queryByRole('link', { name: /查看 Pull Request/i })).not.toBeInTheDocument();
    });
  });
});
