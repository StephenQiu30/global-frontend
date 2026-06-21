'use client';

import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PublicRepositoryPreview } from './PublicRepositoryPreview';
import { PreviewResult } from './PreviewResult';

interface PreviewPageProps {
  className?: string;
}

// Mock data for preview
const MOCK_TRANSLATED_CONTENT = `# Welcome to Our Project

This is a sample translated README file. The translation preserves the original Markdown structure while converting the content to the target language.

## Features

- Feature 1: Description of the first feature
- Feature 2: Description of the second feature
- Feature 3: Description of the third feature

## Installation

\`\`\`bash
npm install
npm run dev
\`\`\`

## Contributing

Please read our contributing guidelines before submitting a pull request.
`;

export function PreviewPage({ className }: PreviewPageProps) {
  const [step, setStep] = useState<'input' | 'preview'>('input');
  const [repoUrl, setRepoUrl] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('en');

  const handleSubmit = (url: string, language: string) => {
    setRepoUrl(url);
    setTargetLanguage(language);
    setStep('preview');
  };

  const handleDownload = () => {
    // Mock download functionality
    const blob = new Blob([MOCK_TRANSLATED_CONTENT], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README_translated.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBack = () => {
    setStep('input');
  };

  const languageLabel =
    targetLanguage === 'en'
      ? 'English'
      : targetLanguage === 'zh'
        ? '中文'
        : targetLanguage === 'ja'
          ? '日本語'
          : targetLanguage;

  return (
    <div className={cn('mx-auto max-w-2xl p-6', className)}>
      {/* 页面标题 */}
      <h1 className="mb-2 text-2xl font-bold text-gray-900">
        公开仓库翻译预览
      </h1>

      {/* 只读声明 */}
      <div className="mb-6 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
        <p className="text-sm text-green-700">
          预览不会写入任何 GitHub 仓库。
        </p>
      </div>

      {/* 内容区域 */}
      {step === 'input' ? (
        <PublicRepositoryPreview onSubmit={handleSubmit} />
      ) : (
        <div className="space-y-4">
          <button
            onClick={handleBack}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            ← 返回修改
          </button>
          <PreviewResult
            translatedContent={MOCK_TRANSLATED_CONTENT}
            fileName="README.md"
            targetLanguage={languageLabel}
            onDownload={handleDownload}
          />
        </div>
      )}
    </div>
  );
}
