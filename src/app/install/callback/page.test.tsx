import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CallbackPage from './page';

// Mock next/navigation useSearchParams
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(window.location.search),
}));

describe('CallbackPage', () => {
  it('shows installation_id when present in URL', () => {
    // Mock window.location.search
    const original = window.location;
    vi.stubGlobal('location', {
      ...original,
      search: '?installation_id=12345',
    });

    render(<CallbackPage />);
    expect(screen.getByText(/安装成功/i)).toBeInTheDocument();
    expect(screen.getByText(/12345/)).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it('shows error when installation_id is missing', () => {
    const original = window.location;
    vi.stubGlobal('location', {
      ...original,
      search: '',
    });

    render(<CallbackPage />);
    expect(screen.getByText(/installation_id 参数缺失/i)).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it('displays authorized repos placeholder', () => {
    const original = window.location;
    vi.stubGlobal('location', {
      ...original,
      search: '?installation_id=12345',
    });

    render(<CallbackPage />);
    expect(screen.getByText(/已授权仓库/i)).toBeInTheDocument();

    vi.unstubAllGlobals();
  });
});
