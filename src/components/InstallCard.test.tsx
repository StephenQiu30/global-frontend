import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import InstallCard from './InstallCard';

describe('InstallCard', () => {
  beforeEach(() => {
    // Reset env var before each test
    process.env.NEXT_PUBLIC_GITHUB_APP_INSTALL_URL = 'https://github.com/apps/test-app/installations/new';
  });

  it('renders install button', () => {
    render(<InstallCard />);
    const button = screen.getByRole('link', { name: /安装 GitHub App/i });
    expect(button).toBeInTheDocument();
  });

  it('links to GitHub App install URL from env', () => {
    render(<InstallCard />);
    const button = screen.getByRole('link', { name: /安装 GitHub App/i });
    expect(button).toHaveAttribute('href', 'https://github.com/apps/test-app/installations/new');
  });

  it('displays permission explanation', () => {
    render(<InstallCard />);
    expect(screen.getByText(/授权 GitHub App 访问你的仓库/i)).toBeInTheDocument();
  });

  it('shows placeholder for authorized repos count', () => {
    render(<InstallCard />);
    expect(screen.getByText(/已授权仓库/i)).toBeInTheDocument();
  });

  it('handles missing env var gracefully', () => {
    delete process.env.NEXT_PUBLIC_GITHUB_APP_INSTALL_URL;
    render(<InstallCard />);
    const button = screen.getByRole('link', { name: /安装 GitHub App/i });
    expect(button).toHaveAttribute('href', '#');
  });
});
