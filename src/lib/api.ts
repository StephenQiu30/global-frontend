import axios from 'axios';
import type {
  FilePreview,
  Installation,
  InstallationRepository,
  MarkdownFile,
  RepositoryInfo,
  TaskResultData,
  TranslationTaskRequest,
  TranslationTaskResponse,
} from '@/lib/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

interface ApiDetail {
  error?: string;
  message?: string;
  retryable?: boolean;
}

interface InstallationVO {
  installation_id: number;
  account_login: string;
  account_type: string;
  repository_selection: string;
}

interface RepositoryItemVO {
  full_name: string;
  default_branch: string;
  private: boolean;
}

interface ResolveRepositoryVO {
  full_name: string;
  default_branch: string;
  private: boolean;
}

interface MarkdownFileVO {
  path: string;
  size_bytes: number;
  is_default_readme: boolean;
  is_translated_variant: boolean;
  disabled_reason: string | null;
  target_path_preview: string;
  target_exists: boolean;
}

interface TranslationTaskCreateVO {
  task_id: string;
  status: string;
}

interface TranslationTaskStatusVO {
  task_id: string;
  status: TaskResultData['status'];
  repository: string;
  language: string;
  pr_url?: string | null;
  pr_number?: number | null;
  file_mappings?: Array<{ source: string; target: string }> | null;
  error_code?: string | null;
  error_message?: string | null;
  created_at: string;
  updated_at: string;
}

interface FilePreviewVO {
  source_path: string;
  target_path: string;
  status: string;
  translated_content?: string | null;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const detail = error.response?.data?.detail as ApiDetail | string | undefined;
      if (typeof detail === 'string') {
        return Promise.reject(new Error(detail));
      }
      const message =
        detail?.message ??
        detail?.error ??
        error.message ??
        '请求失败，请稍后重试';
      return Promise.reject(new Error(message));
    }

    return Promise.reject(error);
  },
);

function normalizeInstallation(data: InstallationVO): Installation {
  return {
    installationId: data.installation_id,
    accountLogin: data.account_login,
    accountType: data.account_type,
    repositorySelection: data.repository_selection,
  };
}

function normalizeRepository(data: ResolveRepositoryVO): RepositoryInfo {
  return {
    fullName: data.full_name,
    defaultBranch: data.default_branch,
    private: data.private,
  };
}

function normalizeInstallationRepository(
  data: RepositoryItemVO,
): InstallationRepository {
  return {
    fullName: data.full_name,
    defaultBranch: data.default_branch,
    private: data.private,
  };
}

function normalizeMarkdownFile(data: MarkdownFileVO): MarkdownFile {
  return {
    path: data.path,
    sizeBytes: data.size_bytes,
    isDefaultReadme: data.is_default_readme,
    isTranslatedVariant: data.is_translated_variant,
    disabledReason: data.disabled_reason,
    targetPathPreview: data.target_path_preview,
    targetExists: data.target_exists,
  };
}

function normalizeTaskStatus(data: TranslationTaskStatusVO): TaskResultData {
  return {
    taskId: data.task_id,
    status: data.status,
    repository: data.repository,
    targetLanguage: data.language,
    selectedFiles: data.file_mappings?.map((mapping) => mapping.source) ?? [],
    prUrl: data.pr_url ?? undefined,
    prNumber: data.pr_number ?? undefined,
    fileMappings: data.file_mappings ?? undefined,
    errorCode: data.error_code ?? undefined,
    errorMessage: data.error_message ?? undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

function normalizeFilePreview(data: FilePreviewVO): FilePreview {
  return {
    sourcePath: data.source_path,
    targetPath: data.target_path,
    status: data.status,
    translatedContent: data.translated_content,
  };
}

export async function verifyInstallation(
  installationId: number,
): Promise<Installation> {
  const response = await apiClient.request<InstallationVO>({
    method: 'POST',
    url: '/api/installations/verify',
    data: { installation_id: installationId },
  });

  return normalizeInstallation(response.data);
}

export async function listInstallationRepositories(
  installationId: number,
): Promise<InstallationRepository[]> {
  const response = await apiClient.request<{ repositories: RepositoryItemVO[] }>({
    method: 'GET',
    url: `/api/installations/${installationId}/repositories`,
  });

  return response.data.repositories.map(normalizeInstallationRepository);
}

export async function resolveRepository(params: {
  input: string;
  installationId: string;
}): Promise<RepositoryInfo> {
  const response = await apiClient.request<ResolveRepositoryVO>({
    method: 'POST',
    url: '/api/repositories/resolve',
    data: {
      input: params.input,
      installation_id: Number(params.installationId),
    },
  });

  return normalizeRepository(response.data);
}

export async function getMarkdownFiles(params: {
  owner: string;
  repo: string;
  installationId: string;
  language: string;
}): Promise<MarkdownFile[]> {
  const response = await apiClient.request<MarkdownFileVO[]>({
    method: 'GET',
    url: `/api/repositories/${params.owner}/${params.repo}/markdown-files`,
    params: {
      installation_id: params.installationId,
      language: params.language,
    },
  });

  return response.data.map(normalizeMarkdownFile);
}

export async function getLanguages() {
  const response = await apiClient.request<Array<{ code: string; label: string }>>({
    method: 'GET',
    url: '/api/languages',
  });

  return response.data;
}

export async function submitTranslationTask(
  request: TranslationTaskRequest,
): Promise<TranslationTaskResponse> {
  const response = await apiClient.request<TranslationTaskCreateVO>({
    method: 'POST',
    url: '/api/translation-tasks',
    data: {
      installation_id: request.installationId,
      repository: request.repository,
      base_branch: request.baseBranch,
      files: request.files,
      language: request.language,
    },
  });

  return {
    taskId: response.data.task_id,
    status: response.data.status,
  };
}

export async function getTaskStatus(taskId: string): Promise<TaskResultData> {
  const response = await apiClient.request<TranslationTaskStatusVO>({
    method: 'GET',
    url: `/api/translation-tasks/${taskId}`,
  });

  return normalizeTaskStatus(response.data);
}

export async function getTaskFilePreviews(taskId: string): Promise<FilePreview[]> {
  const response = await apiClient.request<FilePreviewVO[]>({
    method: 'GET',
    url: `/api/translation-tasks/${taskId}/file-previews`,
  });

  return response.data.map(normalizeFilePreview);
}
