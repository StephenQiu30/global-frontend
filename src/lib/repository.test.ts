import { describe, it, expect } from 'vitest';
import { parseRepositoryInput } from './repository';

describe('parseRepositoryInput', () => {
  describe('valid inputs', () => {
    it('should parse https://github.com/owner/repo', () => {
      const result = parseRepositoryInput('https://github.com/facebook/react');
      expect(result).toEqual({
        owner: 'facebook',
        repo: 'react',
        fullName: 'facebook/react',
      });
    });

    it('should parse https://github.com/owner/repo/ with trailing slash', () => {
      const result = parseRepositoryInput('https://github.com/facebook/react/');
      expect(result).toEqual({
        owner: 'facebook',
        repo: 'react',
        fullName: 'facebook/react',
      });
    });

    it('should parse github.com/owner/repo without protocol', () => {
      const result = parseRepositoryInput('github.com/facebook/react');
      expect(result).toEqual({
        owner: 'facebook',
        repo: 'react',
        fullName: 'facebook/react',
      });
    });

    it('should parse owner/repo shorthand', () => {
      const result = parseRepositoryInput('facebook/react');
      expect(result).toEqual({
        owner: 'facebook',
        repo: 'react',
        fullName: 'facebook/react',
      });
    });

    it('should trim whitespace', () => {
      const result = parseRepositoryInput('  facebook/react  ');
      expect(result).toEqual({
        owner: 'facebook',
        repo: 'react',
        fullName: 'facebook/react',
      });
    });

    it('should preserve case in owner and repo', () => {
      const result = parseRepositoryInput('Facebook/React');
      expect(result).toEqual({
        owner: 'Facebook',
        repo: 'React',
        fullName: 'Facebook/React',
      });
    });
  });

  describe('invalid inputs', () => {
    it('should throw for empty input', () => {
      expect(() => parseRepositoryInput('')).toThrow('仓库地址不能为空');
    });

    it('should throw for whitespace-only input', () => {
      expect(() => parseRepositoryInput('   ')).toThrow('仓库地址不能为空');
    });

    it('should throw for SSH URL', () => {
      expect(() => parseRepositoryInput('git@github.com:facebook/react.git')).toThrow(
        '不支持 SSH 地址，请输入 HTTPS 格式的仓库地址'
      );
    });

    it('should throw for URL with subpath', () => {
      expect(() => parseRepositoryInput('https://github.com/facebook/react/tree/main/docs')).toThrow(
        '请输入仓库根地址，不支持子路径'
      );
    });

    it('should throw for Gist URL', () => {
      expect(() => parseRepositoryInput('https://gist.github.com/user/id')).toThrow(
        '不支持 Gist 地址，请输入仓库地址'
      );
    });

    it('should throw for non-GitHub URL', () => {
      expect(() => parseRepositoryInput('https://gitlab.com/facebook/react')).toThrow(
        '只支持 GitHub 仓库地址'
      );
    });

    it('should throw for invalid owner/repo format', () => {
      expect(() => parseRepositoryInput('facebook')).toThrow(
        '请输入有效的仓库地址，格式为 owner/repo'
      );
    });

    it('should throw for owner/repo with extra segments', () => {
      expect(() => parseRepositoryInput('facebook/react/extra')).toThrow(
        '请输入有效的仓库地址，格式为 owner/repo'
      );
    });

    it('should throw for URL with only owner', () => {
      expect(() => parseRepositoryInput('https://github.com/facebook')).toThrow(
        '请输入有效的仓库地址，格式为 owner/repo'
      );
    });
  });
});
