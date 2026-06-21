'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { TaskResultData } from '@/lib/types';

interface TaskResultProps {
  result: TaskResultData;
}

/**
 * Displays translation task result: success with PR link and file mappings,
 * or failure with error message and retry action.
 */
export function TaskResult({ result }: TaskResultProps) {
  const router = useRouter();

  const handleRetry = useCallback(() => {
    router.push('/translate');
  }, [router]);

  if (result.status === 'succeeded') {
    return (
      <section aria-label="任务结果">
        <h2>翻译完成</h2>

        <div>
          <span>仓库: {result.repository}</span>
          <span>语言: {result.targetLanguage}</span>
        </div>

        {result.prUrl && (
          <div>
            <a href={result.prUrl} target="_blank" rel="noopener noreferrer">
              查看 Pull Request
            </a>
            {result.prTitle && <span>{result.prTitle}</span>}
          </div>
        )}

        {result.fileMappings && result.fileMappings.length > 0 && (
          <div>
            <h3>文件映射</h3>
            <ul>
              {result.fileMappings.map((mapping) => (
                <li key={mapping.source}>
                  {mapping.source} → {mapping.target}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    );
  }

  // Failed state
  return (
    <section aria-label="任务结果">
      <h2>翻译失败</h2>

      {result.errorMessage && (
        <div role="alert">
          <p>{result.errorMessage}</p>
        </div>
      )}

      {result.retryable && (
        <button type="button" onClick={handleRetry}>
          返回修改
        </button>
      )}
    </section>
  );
}
