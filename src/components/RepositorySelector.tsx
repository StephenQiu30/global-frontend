import { useState } from 'react';
import { parseRepositoryInput, type RepositoryRef } from '@/lib/repository';

interface RepositoryInfo extends RepositoryRef {
  defaultBranch: string;
  visibility: 'public' | 'private';
  isAuthorized: boolean;
  error?: string;
}

interface RepositorySelectorProps {
  onRepositoryVerified?: (repo: RepositoryInfo) => void;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export function RepositorySelector({ onRepositoryVerified }: RepositorySelectorProps) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [repository, setRepository] = useState<RepositoryInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleVerify = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setStatus('loading');
    setErrorMessage('');
    setRepository(null);

    try {
      // Parse input (may throw for invalid formats)
      let parsed: RepositoryRef;
      try {
        parsed = parseRepositoryInput(trimmed);
      } catch (parseError) {
        setStatus('error');
        setErrorMessage(parseError instanceof Error ? parseError.message : '输入格式错误');
        return;
      }

      // Call API
      const response = await fetch('/api/repositories/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repository: parsed.fullName }),
      });

      const data = await response.json();

      if (data.error === 'repository_not_installed') {
        setStatus('error');
        setErrorMessage('仓库未授权，请先安装 GitHub App');
        return;
      }

      if (data.error === 'repository_not_found') {
        setStatus('error');
        setErrorMessage('仓库不存在，请检查地址是否正确');
        return;
      }

      if (data.error) {
        setStatus('error');
        setErrorMessage('校验失败，请稍后重试');
        return;
      }

      // Success
      const repoInfo: RepositoryInfo = {
        owner: data.owner,
        repo: data.repo,
        fullName: data.fullName,
        defaultBranch: data.defaultBranch,
        visibility: data.visibility,
        isAuthorized: data.isAuthorized,
      };

      setRepository(repoInfo);
      setStatus('success');
      onRepositoryVerified?.(repoInfo);
    } catch (err) {
      setStatus('error');
      setErrorMessage('网络错误，请稍后重试');
    }
  };

  const isDisabled = !input.trim() || status === 'loading';

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入 GitHub 仓库地址，例如 facebook/react"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={status === 'loading'}
        />
        <button
          onClick={handleVerify}
          disabled={isDisabled}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? '校验中...' : '校验仓库'}
        </button>
      </div>

      {status === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {errorMessage}
        </div>
      )}

      {status === 'success' && repository && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="font-semibold text-green-800">{repository.fullName}</div>
          <div className="text-sm text-green-600 mt-1">
            默认分支: {repository.defaultBranch}
          </div>
          <div className="text-sm text-green-600">
            可见性: {repository.visibility}
          </div>
          <div className="text-sm text-green-600">
            {repository.isAuthorized ? '✓ 已授权' : '✗ 未授权'}
          </div>
        </div>
      )}
    </div>
  );
}
