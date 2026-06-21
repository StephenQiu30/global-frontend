'use client';

export default function InstallCard() {
  const installUrl = process.env.NEXT_PUBLIC_GITHUB_APP_INSTALL_URL || '#';

  return (
    <div style={{ border: '1px solid #e1e4e8', borderRadius: 6, padding: 24, maxWidth: 480 }}>
      <h2 style={{ marginTop: 0 }}>安装 GitHub App</h2>
      <p style={{ color: '#57606a', marginBottom: 16 }}>
        授权 GitHub App 访问你的仓库，以便进行文档翻译和管理。
      </p>
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontWeight: 600 }}>已授权仓库：</span>
        <span>等待后端验证</span>
      </div>
      <a
        href={installUrl}
        style={{
          display: 'inline-block',
          padding: '8px 16px',
          backgroundColor: '#238636',
          color: '#ffffff',
          borderRadius: 6,
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        安装 GitHub App
      </a>
    </div>
  );
}
