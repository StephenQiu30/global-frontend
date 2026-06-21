import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TranslatePage from './page';
import {
  getMarkdownFiles,
  resolveRepository,
  submitTranslationTask,
} from '@/lib/api';

vi.mock('@/lib/api', () => ({
  getMarkdownFiles: vi.fn(),
  resolveRepository: vi.fn(),
  submitTranslationTask: vi.fn(),
}));

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockResolveRepository = vi.mocked(resolveRepository);
const mockGetMarkdownFiles = vi.mocked(getMarkdownFiles);
const mockSubmitTranslationTask = vi.mocked(submitTranslationTask);

const markdownFiles = [
  {
    path: 'README.md',
    sizeBytes: 1024,
    isDefaultReadme: true,
    isTranslatedVariant: false,
    disabledReason: null,
    targetPathPreview: 'README.zh-CN.md',
    targetExists: false,
  },
  {
    path: 'docs/api/reference.md',
    sizeBytes: 4096,
    isDefaultReadme: false,
    isTranslatedVariant: false,
    disabledReason: null,
    targetPathPreview: 'docs/api/reference.zh-CN.md',
    targetExists: true,
  },
];

async function scanRepository() {
  const user = userEvent.setup();

  await user.type(
    screen.getByPlaceholderText(/输入 GitHub 仓库地址，例如 owner\/repo/i),
    'facebook/react',
  );
  await user.click(screen.getByRole('button', { name: /扫描文件/i }));
}

describe('TranslatePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockResolveRepository.mockResolvedValue({
      fullName: 'facebook/react',
      defaultBranch: 'main',
      private: false,
    });
    mockGetMarkdownFiles.mockResolvedValue(markdownFiles);
  });

  it('renders the minimal SaaS repository scan entry point', () => {
    render(<TranslatePage />);

    expect(
      screen.getByRole('heading', { name: 'GitHub 文档翻译' }),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/输入 GitHub 仓库地址，例如 owner\/repo/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /扫描文件/i })).toBeInTheDocument();
  });

  it('disables submit before a repository is scanned', () => {
    render(<TranslatePage />);

    expect(
      screen.getByRole('button', { name: /提交翻译任务/i }),
    ).toBeDisabled();
  });

  it('scans a repository and renders selectable markdown files', async () => {
    render(<TranslatePage />);

    await scanRepository();

    await waitFor(() => {
      expect(screen.getByText('facebook/react · 默认分支 main')).toBeInTheDocument();
    });
    expect(screen.getByText('README.md')).toBeInTheDocument();
    expect(screen.getByText('docs/api/reference.md')).toBeInTheDocument();
    expect(screen.getByText('目标文件已存在')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'README.md' })).toBeChecked();
  });

  it('submits the backend DTO shape and navigates on success', async () => {
    mockSubmitTranslationTask.mockResolvedValueOnce({
      taskId: 'task-123',
      status: 'queued',
    });
    const user = userEvent.setup();

    render(<TranslatePage />);
    await scanRepository();

    const submitButton = await screen.findByRole('button', {
      name: /提交翻译任务/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSubmitTranslationTask).toHaveBeenCalledWith({
        installationId: '123456',
        repository: 'facebook/react',
        baseBranch: 'main',
        files: ['README.md'],
        language: 'zh-CN',
      });
    });
    expect(mockPush).toHaveBeenCalledWith('/tasks/task-123');
  });

  it('shows scan errors without revealing backend details', async () => {
    mockResolveRepository.mockRejectedValueOnce(new Error('仓库未授权'));

    render(<TranslatePage />);
    await scanRepository();

    expect(await screen.findByText('仓库未授权')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /提交翻译任务/i }),
    ).toBeDisabled();
  });
});
