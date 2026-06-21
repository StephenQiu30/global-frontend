import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TranslatePage from './page';

// Mock the API module
vi.mock('@/lib/api', () => ({
  submitTranslationTask: vi.fn(),
}));

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

import { submitTranslationTask } from '@/lib/api';

const mockSubmitTranslationTask = vi.mocked(submitTranslationTask);

function selectRepository() {
  const repoButton = screen.getByRole('button', { name: /选择仓库/i });
  return userEvent.click(repoButton);
}

function selectFile() {
  const fileCheckbox = screen.getByRole('checkbox', { name: /README\.md/i });
  return userEvent.click(fileCheckbox);
}

function selectLanguage() {
  const languageSelect = screen.getByLabelText(/目标语言/i);
  return userEvent.selectOptions(languageSelect, 'ja');
}

describe('TranslatePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('disables submit button when no repository is selected', () => {
    render(<TranslatePage />);
    const submitButton = screen.getByRole('button', { name: /提交翻译/i });
    expect(submitButton).toBeDisabled();
  });

  it('disables submit button when no files are selected', async () => {
    render(<TranslatePage />);
    await selectRepository();
    const submitButton = screen.getByRole('button', { name: /提交翻译/i });
    expect(submitButton).toBeDisabled();
  });

  it('disables submit button when no language is selected', async () => {
    render(<TranslatePage />);
    await selectRepository();
    await selectFile();
    // Language defaults to zh-CN, so clear it
    const languageSelect = screen.getByLabelText(/目标语言/i);
    await userEvent.selectOptions(languageSelect, '');
    const submitButton = screen.getByRole('button', { name: /提交翻译/i });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when all selections are valid', async () => {
    render(<TranslatePage />);
    await selectRepository();
    await selectFile();
    const submitButton = screen.getByRole('button', { name: /提交翻译/i });
    expect(submitButton).toBeEnabled();
  });

  it('submits task payload and navigates on success', async () => {
    mockSubmitTranslationTask.mockResolvedValueOnce({ taskId: 'task-123' });
    const user = userEvent.setup();

    render(<TranslatePage />);
    await selectRepository();
    await selectFile();

    const submitButton = screen.getByRole('button', { name: /提交翻译/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSubmitTranslationTask).toHaveBeenCalledWith(
        expect.objectContaining({
          repository: expect.objectContaining({ fullName: 'owner/repo' }),
          files: expect.arrayContaining([
            expect.objectContaining({ path: 'README.md' }),
          ]),
          targetLanguage: 'zh-CN',
        }),
      );
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/tasks/task-123');
    });
  });

  it('displays error message on submission failure', async () => {
    mockSubmitTranslationTask.mockRejectedValueOnce(
      new Error('翻译服务暂时不可用'),
    );
    const user = userEvent.setup();

    render(<TranslatePage />);
    await selectRepository();
    await selectFile();

    const submitButton = screen.getByRole('button', { name: /提交翻译/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/翻译服务暂时不可用/i)).toBeInTheDocument();
    });

    // Button should be re-enabled after error
    expect(submitButton).toBeEnabled();
  });

  it('shows loading indicator during submission', async () => {
    let resolveSubmit: (value: { taskId: string }) => void;
    mockSubmitTranslationTask.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSubmit = resolve;
        }),
    );
    const user = userEvent.setup();

    render(<TranslatePage />);
    await selectRepository();
    await selectFile();

    const submitButton = screen.getByRole('button', { name: /提交翻译/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/提交中/i)).toBeInTheDocument();
    });

    resolveSubmit!({ taskId: 'task-456' });

    await waitFor(() => {
      expect(screen.queryByText(/提交中/i)).not.toBeInTheDocument();
    });
  });
});
