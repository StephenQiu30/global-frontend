'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { submitTranslationTask } from '@/lib/api';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/lib/languages';
import type { RepositoryInfo, TranslationFile } from '@/lib/types';

/**
 * Translation task submission page.
 * Composes repository, file, and language selection into a single submit flow.
 */
export default function TranslatePage() {
  const router = useRouter();

  const [repository, setRepository] = useState<RepositoryInfo | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<TranslationFile[]>([]);
  const [targetLanguage, setTargetLanguage] = useState(DEFAULT_LANGUAGE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = useMemo(
    () => repository !== null && selectedFiles.length > 0 && targetLanguage !== '',
    [repository, selectedFiles, targetLanguage],
  );

  const handleSubmit = useCallback(async () => {
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await submitTranslationTask({
        repository: repository!,
        files: selectedFiles,
        targetLanguage,
      });
      router.push(`/tasks/${response.taskId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失败');
    } finally {
      setIsSubmitting(false);
    }
  }, [isValid, isSubmitting, repository, selectedFiles, targetLanguage, router]);

  const handleSelectRepository = useCallback(() => {
    // Stub: simulate selecting a repository
    setRepository({
      owner: 'owner',
      repo: 'repo',
      fullName: 'owner/repo',
      defaultBranch: 'main',
    });
  }, []);

  const handleToggleFile = useCallback((path: string, targetPath: string) => {
    setSelectedFiles((prev) => {
      const exists = prev.some((f) => f.path === path);
      if (exists) return prev.filter((f) => f.path !== path);
      return [...prev, { path, targetPath }];
    });
  }, []);

  return (
    <main style={{ padding: 24, maxWidth: 640, margin: '0 auto' }}>
      <h1>翻译任务提交</h1>

      {/* Repository Selector Stub */}
      <section style={{ marginBottom: 16 }}>
        <h2>仓库选择</h2>
        {repository ? (
          <p>已选择: {repository.fullName}</p>
        ) : (
          <button type="button" onClick={handleSelectRepository}>
            选择仓库
          </button>
        )}
      </section>

      {/* Markdown File Picker Stub */}
      <section style={{ marginBottom: 16 }}>
        <h2>文件选择</h2>
        <label>
          <input
            type="checkbox"
            checked={selectedFiles.some((f) => f.path === 'README.md')}
            onChange={() =>
              handleToggleFile('README.md', 'README.zh-CN.md')
            }
          />
          README.md
        </label>
      </section>

      {/* Language Selector */}
      <section style={{ marginBottom: 16 }}>
        <label htmlFor="language-select">目标语言</label>
        <select
          id="language-select"
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
        >
          <option value="">请选择</option>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label} ({lang.code})
            </option>
          ))}
        </select>
      </section>

      {/* Error Display */}
      {error && (
        <div role="alert" style={{ color: 'red', marginBottom: 16 }}>
          {error}
          <button
            type="button"
            onClick={() => setError(null)}
            style={{ marginLeft: 8 }}
            aria-label="关闭错误提示"
          >
            ✕
          </button>
        </div>
      )}

      {/* Submit */}
      <button
        type="button"
        disabled={!isValid || isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? '提交中...' : '提交翻译'}
      </button>
    </main>
  );
}
