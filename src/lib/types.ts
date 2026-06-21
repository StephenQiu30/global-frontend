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
