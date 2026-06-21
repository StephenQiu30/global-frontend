import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RepositorySelector } from './RepositorySelector';

// Mock the fetch API
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('RepositorySelector', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('should render input field and button', () => {
    render(<RepositorySelector />);

    expect(screen.getByPlaceholderText(/输入 GitHub 仓库地址/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /校验仓库/ })).toBeInTheDocument();
  });

  it('should disable button when input is empty', async () => {
    render(<RepositorySelector />);

    const button = screen.getByRole('button', { name: /校验仓库/ });
    expect(button).toBeDisabled();
  });

  it('should enable button when input has value', async () => {
    const user = userEvent.setup();
    render(<RepositorySelector />);

    const input = screen.getByPlaceholderText(/输入 GitHub 仓库地址/);
    await user.type(input, 'facebook/react');

    const button = screen.getByRole('button', { name: /校验仓库/ });
    expect(button).not.toBeDisabled();
  });

  it('should show error for invalid input format', async () => {
    const user = userEvent.setup();
    render(<RepositorySelector />);

    const input = screen.getByPlaceholderText(/输入 GitHub 仓库地址/);
    await user.type(input, 'git@github.com:facebook/react.git');

    const button = screen.getByRole('button', { name: /校验仓库/ });
    await user.click(button);

    expect(screen.getByText(/不支持 SSH 地址/)).toBeInTheDocument();
  });

  it('should call API with valid input', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        owner: 'facebook',
        repo: 'react',
        fullName: 'facebook/react',
        defaultBranch: 'main',
        visibility: 'public',
        isAuthorized: true,
      }),
    });

    const user = userEvent.setup();
    render(<RepositorySelector />);

    const input = screen.getByPlaceholderText(/输入 GitHub 仓库地址/);
    await user.type(input, 'facebook/react');

    const button = screen.getByRole('button', { name: /校验仓库/ });
    await user.click(button);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/repositories/resolve',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ repository: 'facebook/react' }),
        })
      );
    });
  });

  it('should display repository info on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        owner: 'facebook',
        repo: 'react',
        fullName: 'facebook/react',
        defaultBranch: 'main',
        visibility: 'public',
        isAuthorized: true,
      }),
    });

    const user = userEvent.setup();
    render(<RepositorySelector />);

    const input = screen.getByPlaceholderText(/输入 GitHub 仓库地址/);
    await user.type(input, 'facebook/react');

    const button = screen.getByRole('button', { name: /校验仓库/ });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('facebook/react')).toBeInTheDocument();
      expect(screen.getByText(/默认分支: main/)).toBeInTheDocument();
      expect(screen.getByText(/可见性: public/)).toBeInTheDocument();
      expect(screen.getByText(/已授权/)).toBeInTheDocument();
    });
  });

  it('should show error when repository is not authorized', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        owner: 'facebook',
        repo: 'react',
        fullName: 'facebook/react',
        defaultBranch: 'main',
        visibility: 'public',
        isAuthorized: false,
        error: 'repository_not_installed',
      }),
    });

    const user = userEvent.setup();
    render(<RepositorySelector />);

    const input = screen.getByPlaceholderText(/输入 GitHub 仓库地址/);
    await user.type(input, 'facebook/react');

    const button = screen.getByRole('button', { name: /校验仓库/ });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/仓库未授权/)).toBeInTheDocument();
      expect(screen.getByText(/请先安装 GitHub App/)).toBeInTheDocument();
    });
  });

  it('should show error when repository not found', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        error: 'repository_not_found',
      }),
    });

    const user = userEvent.setup();
    render(<RepositorySelector />);

    const input = screen.getByPlaceholderText(/输入 GitHub 仓库地址/);
    await user.type(input, 'nonexistent/repo');

    const button = screen.getByRole('button', { name: /校验仓库/ });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/仓库不存在/)).toBeInTheDocument();
    });
  });

  it('should show loading state during API call', async () => {
    mockFetch.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    const user = userEvent.setup();
    render(<RepositorySelector />);

    const input = screen.getByPlaceholderText(/输入 GitHub 仓库地址/);
    await user.type(input, 'facebook/react');

    const button = screen.getByRole('button', { name: /校验仓库/ });
    await user.click(button);

    expect(screen.getByText(/校验中/)).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('should handle network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const user = userEvent.setup();
    render(<RepositorySelector />);

    const input = screen.getByPlaceholderText(/输入 GitHub 仓库地址/);
    await user.type(input, 'facebook/react');

    const button = screen.getByRole('button', { name: /校验仓库/ });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/网络错误，请稍后重试/)).toBeInTheDocument();
    });
  });

  it('should call onRepositoryVerified when repository is authorized', async () => {
    const onRepositoryVerified = vi.fn();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        owner: 'facebook',
        repo: 'react',
        fullName: 'facebook/react',
        defaultBranch: 'main',
        visibility: 'public',
        isAuthorized: true,
      }),
    });

    const user = userEvent.setup();
    render(<RepositorySelector onRepositoryVerified={onRepositoryVerified} />);

    const input = screen.getByPlaceholderText(/输入 GitHub 仓库地址/);
    await user.type(input, 'facebook/react');

    const button = screen.getByRole('button', { name: /校验仓库/ });
    await user.click(button);

    await waitFor(() => {
      expect(onRepositoryVerified).toHaveBeenCalledWith({
        owner: 'facebook',
        repo: 'react',
        fullName: 'facebook/react',
        defaultBranch: 'main',
        visibility: 'public',
        isAuthorized: true,
      });
    });
  });
});
