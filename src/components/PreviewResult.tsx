'use client';

import { Download, GitPullRequest, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PreviewResultProps {
  translatedContent: string;
  fileName: string;
  targetLanguage: string;
  onDownload: () => void;
  className?: string;
}

export function PreviewResult({
  translatedContent,
  fileName,
  targetLanguage,
  onDownload,
  className,
}: PreviewResultProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* 文件信息 */}
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{fileName}</span>
          <span className="mx-2">→</span>
          <span>{targetLanguage}</span>
        </div>
        <button
          onClick={onDownload}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Download className="h-4 w-4" />
          下载
        </button>
      </div>

      {/* 预览内容 */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-medium text-gray-700">翻译预览</h3>
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap text-sm text-gray-800">
            {translatedContent}
          </pre>
        </div>
      </div>

      {/* 安装 CTA */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <GitPullRequest className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">
              安装 GitHub App 后提交 PR
            </h4>
            <p className="mt-1 text-sm text-blue-700">
              安装 GitHub App 后，可以将翻译结果直接提交为 Pull Request 到原仓库。
            </p>
            <button className="mt-3 flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              <ExternalLink className="h-4 w-4" />
              安装 GitHub App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
