'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function CallbackContent() {
  const searchParams = useSearchParams();
  const installationId = searchParams.get('installation_id');

  if (!installationId) {
    return (
      <main style={{ padding: 24, maxWidth: 480, margin: '0 auto' }}>
        <h1>安装回调</h1>
        <div style={{ padding: 16, backgroundColor: '#ffebe9', borderRadius: 6, border: '1px solid #ff8182' }}>
          <p style={{ margin: 0, color: '#cf222e' }}>installation_id 参数缺失</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 480, margin: '0 auto' }}>
      <h1>安装回调</h1>
      <div style={{ padding: 16, backgroundColor: '#dafbe1', borderRadius: 6, border: '1px solid #4ac26b' }}>
        <p style={{ margin: 0, color: '#116329' }}>安装成功</p>
      </div>
      <div style={{ marginTop: 16 }}>
        <p><strong>Installation ID:</strong> {installationId}</p>
        <p><strong>已授权仓库：</strong>等待后端验证</p>
      </div>
    </main>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <CallbackContent />
    </Suspense>
  );
}
