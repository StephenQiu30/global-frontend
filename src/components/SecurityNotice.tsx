'use client';

import { ShieldCheck, GitPullRequest, Key, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SecurityNoticeProps {
  error?: string;
  className?: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  repository_not_installed: '仓库未授权，无法进行翻译',
  invalid_path: '文件路径不合法，包含不允许的字符',
  size_limit_exceeded: '翻译任务超出大小限制，请减少文件数量或大小',
};

export function SecurityNotice({ error, className }: SecurityNoticeProps) {
  const errorMessage = error ? ERROR_MESSAGES[error] || '发生未知错误' : null;

  return (
    <div className={cn('space-y-3', className)}>
      {/* 安全提示区域 */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-800">
          <ShieldCheck className="h-4 w-4" />
          安全保障
        </h3>
        <ul className="space-y-2 text-sm text-blue-700">
          <li className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            <span>不会覆盖原始文件</span>
          </li>
          <li className="flex items-start gap-2">
            <GitPullRequest className="mt-0.5 h-4 w-4 shrink-0" />
            <span>所有变更通过 Pull Request 审核</span>
          </li>
          <li className="flex items-start gap-2">
            <Key className="mt-0.5 h-4 w-4 shrink-0" />
            <span>敏感凭据不由前端处理</span>
          </li>
        </ul>
      </div>

      {/* 错误提示区域 */}
      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div>
            <h4 className="text-sm font-medium text-red-800">翻译错误</h4>
            <p className="mt-1 text-sm text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
