'use client';

import { useState } from 'react';
import { Search, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PublicRepositoryPreviewProps {
  onSubmit: (repoUrl: string, targetLanguage: string) => void;
  className?: string;
}

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
];

export function PublicRepositoryPreview({
  onSubmit,
  className,
}: PublicRepositoryPreviewProps) {
  const [repoUrl, setRepoUrl] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [error, setError] = useState('');

  const validateUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return parsed.hostname === 'github.com' && parsed.pathname.split('/').length >= 3;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!repoUrl.trim()) {
      setError('请输入仓库 URL');
      return;
    }

    if (!validateUrl(repoUrl)) {
      setError('请输入有效的 GitHub 仓库 URL');
      return;
    }

    onSubmit(repoUrl, targetLanguage);
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      {/* 仓库 URL 输入 */}
      <div>
        <label
          htmlFor="repo-url"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          仓库 URL
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            id="repo-url"
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/owner/repo"
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* 语言选择 */}
      <div>
        <label
          htmlFor="target-language"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          目标语言
        </label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <select
            id="target-language"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="w-full appearance-none rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 提交按钮 */}
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        预览翻译
      </button>
    </form>
  );
}
