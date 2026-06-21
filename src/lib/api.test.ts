import { beforeEach, describe, expect, it, vi } from 'vitest';

const axiosRequest = vi.hoisted(() => vi.fn());
const responseInterceptorUse = vi.hoisted(() => vi.fn());

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      request: axiosRequest,
      interceptors: {
        response: {
          use: responseInterceptorUse,
        },
      },
    })),
  },
  isAxiosError: vi.fn(),
}));

describe('api client', () => {
  beforeEach(() => {
    vi.resetModules();
    axiosRequest.mockReset();
    responseInterceptorUse.mockClear();
  });

  it('submits translation tasks with backend DTO field names', async () => {
    axiosRequest.mockResolvedValueOnce({
      data: { task_id: 'task-123', status: 'queued' },
    });

    const { submitTranslationTask } = await import('./api');

    await expect(
      submitTranslationTask({
        installationId: '123456',
        repository: 'facebook/react',
        baseBranch: 'main',
        files: ['README.md', 'docs/api.md'],
        language: 'ja',
      }),
    ).resolves.toEqual({ taskId: 'task-123', status: 'queued' });

    expect(axiosRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/api/translation-tasks',
      data: {
        installation_id: '123456',
        repository: 'facebook/react',
        base_branch: 'main',
        files: ['README.md', 'docs/api.md'],
        language: 'ja',
      },
    });
  });

  it('normalizes task status responses from backend VO field names', async () => {
    axiosRequest.mockResolvedValueOnce({
      data: {
        task_id: 'task-123',
        status: 'succeeded',
        repository: 'facebook/react',
        language: 'ja',
        pr_url: 'https://github.com/facebook/react/pull/1',
        pr_number: 1,
        file_mappings: [{ source: 'README.md', target: 'README.ja.md' }],
        created_at: '2026-06-21T00:00:00Z',
        updated_at: '2026-06-21T00:01:00Z',
      },
    });

    const { getTaskStatus } = await import('./api');

    await expect(getTaskStatus('task-123')).resolves.toMatchObject({
      taskId: 'task-123',
      status: 'succeeded',
      repository: 'facebook/react',
      targetLanguage: 'ja',
      prUrl: 'https://github.com/facebook/react/pull/1',
      prNumber: 1,
      fileMappings: [{ source: 'README.md', target: 'README.ja.md' }],
    });

    expect(axiosRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/api/translation-tasks/task-123',
    });
  });
});
