import type {
  TranslationTaskRequest,
  TranslationTaskResponse,
  TaskResultData,
} from '@/lib/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

/**
 * Submit a translation task to the backend.
 * Throws on non-2xx response with the server error message.
 */
export async function submitTranslationTask(
  request: TranslationTaskRequest,
): Promise<TranslationTaskResponse> {
  const res = await fetch(`${API_BASE_URL}/api/translation-tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.message ?? `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return res.json();
}

/**
 * Get task status by ID.
 * Throws on non-2xx response with the server error message.
 */
export async function getTaskStatus(taskId: string): Promise<TaskResultData> {
  const res = await fetch(`${API_BASE_URL}/api/translation-tasks/${taskId}`);

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.message ?? `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return res.json();
}
