'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getTaskStatus } from '@/lib/api';
import { TaskResult } from '@/components/TaskResult';
import type { TaskResultData } from '@/lib/types';

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_DURATION_MS = 120000;

/**
 * Task status page with polling.
 * Displays task result or timeout message after 2 minutes.
 */
export default function TaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.taskId as string;

  const [result, setResult] = useState<TaskResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTimeout, setIsTimeout] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startTimeRef = useRef(Date.now());

  const isTerminal = result?.status === 'succeeded' || result?.status === 'failed';

  const fetchStatus = useCallback(async () => {
    try {
      const data = await getTaskStatus(taskId);
      setResult(data);
      setIsLoading(false);

      if (data.status === 'succeeded' || data.status === 'failed') {
        return true; // Terminal state
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取任务状态失败');
      setIsLoading(false);
      return true; // Stop polling on error
    }
  }, [taskId]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    let timeoutId: ReturnType<typeof setTimeout>;

    const startPolling = async () => {
      // Initial fetch
      const isDone = await fetchStatus();
      if (isDone) return;

      // Set up polling interval
      intervalId = setInterval(async () => {
        const elapsed = Date.now() - startTimeRef.current;
        if (elapsed >= MAX_POLL_DURATION_MS) {
          clearInterval(intervalId);
          setIsTimeout(true);
          return;
        }

        const isDone = await fetchStatus();
        if (isDone) {
          clearInterval(intervalId);
        }
      }, POLL_INTERVAL_MS);

      // Safety timeout
      timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        setIsTimeout(true);
      }, MAX_POLL_DURATION_MS);
    };

    startPolling();

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [fetchStatus]);

  if (isLoading) {
    return (
      <main style={{ padding: 24, maxWidth: 640, margin: '0 auto' }}>
        <h1>任务状态</h1>
        <p>加载中...</p>
      </main>
    );
  }

  if (isTimeout) {
    return (
      <main style={{ padding: 24, maxWidth: 640, margin: '0 auto' }}>
        <h1>任务状态</h1>
        <div role="alert">
          <p>任务仍在处理或已超时</p>
        </div>
        <button type="button" onClick={() => router.push('/translate')}>
          返回修改
        </button>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ padding: 24, maxWidth: 640, margin: '0 auto' }}>
        <h1>任务状态</h1>
        <div role="alert">
          <p>{error}</p>
        </div>
        <button type="button" onClick={() => router.push('/translate')}>
          返回修改
        </button>
      </main>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <main style={{ padding: 24, maxWidth: 640, margin: '0 auto' }}>
      <h1>任务状态</h1>
      <TaskResult result={result} />
    </main>
  );
}
