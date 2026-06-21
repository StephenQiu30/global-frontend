export interface RepositoryRef {
  owner: string;
  repo: string;
  fullName: string;
}

export function parseRepositoryInput(input: string): RepositoryRef {
  const trimmed = input.trim();

  if (!trimmed) {
    throw new Error('仓库地址不能为空');
  }

  // Check for SSH URL
  if (trimmed.startsWith('git@')) {
    throw new Error('不支持 SSH 地址，请输入 HTTPS 格式的仓库地址');
  }

  // Check for Gist
  if (trimmed.includes('gist.github.com')) {
    throw new Error('不支持 Gist 地址，请输入仓库地址');
  }

  // Check for non-GitHub URL (if it looks like a URL but not GitHub)
  if (
    (trimmed.startsWith('https://') || trimmed.startsWith('http://')) &&
    !trimmed.includes('github.com')
  ) {
    throw new Error('只支持 GitHub 仓库地址');
  }

  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    return parseGitHubUrl(trimmed);
  }

  if (trimmed.startsWith('github.com')) {
    return parseGitHubUrl('https://' + trimmed);
  }

  // owner/repo format
  return parseOwnerRepo(trimmed);
}

function parseGitHubUrl(url: string): RepositoryRef {
  const urlObj = new URL(url);

  if (urlObj.hostname !== 'github.com') {
    throw new Error('只支持 GitHub 仓库地址');
  }

  const pathParts = urlObj.pathname.split('/').filter(Boolean);

  if (pathParts.length < 2) {
    throw new Error('请输入有效的仓库地址，格式为 owner/repo');
  }

  if (pathParts.length > 2) {
    throw new Error('请输入仓库根地址，不支持子路径');
  }

  const [owner, repo] = pathParts;

  return {
    owner,
    repo,
    fullName: `${owner}/${repo}`,
  };
}

function parseOwnerRepo(input: string): RepositoryRef {
  const parts = input.split('/');

  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error('请输入有效的仓库地址，格式为 owner/repo');
  }

  const [owner, repo] = parts;

  return {
    owner,
    repo,
    fullName: `${owner}/${repo}`,
  };
}
