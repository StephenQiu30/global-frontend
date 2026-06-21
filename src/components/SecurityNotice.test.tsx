import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SecurityNotice } from './SecurityNotice';

describe('SecurityNotice', () => {
  describe('安全提示文案', () => {
    it('应展示"不会覆盖原始文件"提示', () => {
      render(<SecurityNotice />);
      expect(screen.getByText('不会覆盖原始文件')).toBeInTheDocument();
    });

    it('应展示"所有变更通过 Pull Request 审核"提示', () => {
      render(<SecurityNotice />);
      expect(screen.getByText(/所有变更通过 Pull Request 审核/)).toBeInTheDocument();
    });

    it('应展示 token 保护提示', () => {
      render(<SecurityNotice />);
      expect(screen.getByText(/敏感凭据不由前端处理/)).toBeInTheDocument();
    });
  });

  describe('后端错误处理', () => {
    it('应处理 unauthorized 错误码', () => {
      render(<SecurityNotice error="repository_not_installed" />);
      expect(screen.getByText(/仓库未授权/)).toBeInTheDocument();
    });

    it('应处理 path 错误码', () => {
      render(<SecurityNotice error="invalid_path" />);
      expect(screen.getByText(/文件路径不合法/)).toBeInTheDocument();
    });

    it('应处理 size 错误码', () => {
      render(<SecurityNotice error="size_limit_exceeded" />);
      expect(screen.getByText(/超出大小限制/)).toBeInTheDocument();
    });

    it('无错误时不应显示错误提示', () => {
      render(<SecurityNotice />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
