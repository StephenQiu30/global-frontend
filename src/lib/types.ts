/** Repository information returned after verification. */
export interface RepositoryInfo {
  owner: string;
  repo: string;
  fullName: string;
  defaultBranch: string;
}

/** A file selected for translation. */
export interface TranslationFile {
  path: string;
  targetPath: string;
}

/** Request payload for POST /api/translation-tasks. */
export interface TranslationTaskRequest {
  repository: RepositoryInfo;
  files: TranslationFile[];
  targetLanguage: string;
}

/** Response from POST /api/translation-tasks. */
export interface TranslationTaskResponse {
  taskId: string;
}

/** Possible task statuses. */
export type TaskStatus = 'queued' | 'running' | 'succeeded' | 'failed';

/** Source-to-target file mapping. */
export interface FileMapping {
  source: string;
  target: string;
}

/** Task result data returned by GET /api/translation-tasks/{taskId}. */
export interface TaskResultData {
  taskId: string;
  status: TaskStatus;
  repository: string;
  targetLanguage: string;
  selectedFiles: string[];
  prUrl?: string;
  prTitle?: string;
  fileMappings?: FileMapping[];
  errorCode?: string;
  errorMessage?: string;
  retryable?: boolean;
}
