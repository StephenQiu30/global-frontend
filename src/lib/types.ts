export interface Installation {
  installationId: number;
  accountLogin: string;
  accountType: string;
  repositorySelection: string;
}

export interface InstallationRepository {
  fullName: string;
  defaultBranch: string;
  private: boolean;
}

export interface RepositoryInfo {
  fullName: string;
  defaultBranch: string;
  private: boolean;
}

export interface MarkdownFile {
  path: string;
  sizeBytes: number;
  isDefaultReadme: boolean;
  isTranslatedVariant: boolean;
  disabledReason: string | null;
  targetPathPreview: string;
  targetExists: boolean;
}

export interface TranslationTaskRequest {
  installationId: string;
  repository: string;
  baseBranch: string;
  files: string[];
  language: string;
}

export interface TranslationTaskResponse {
  taskId: string;
  status: string;
}

export type TaskStatus = 'queued' | 'running' | 'succeeded' | 'failed';

export interface FileMapping {
  source: string;
  target: string;
}

export interface TaskResultData {
  taskId: string;
  status: TaskStatus;
  repository: string;
  targetLanguage: string;
  selectedFiles: string[];
  prUrl?: string;
  prNumber?: number;
  fileMappings?: FileMapping[];
  errorCode?: string;
  errorMessage?: string;
  retryable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FilePreview {
  sourcePath: string;
  targetPath: string;
  status: string;
  translatedContent?: string | null;
}
