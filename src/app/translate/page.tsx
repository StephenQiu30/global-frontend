'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GitPullRequest, Loader2, Search } from 'lucide-react';
import {
  getMarkdownFiles,
  resolveRepository,
  submitTranslationTask,
} from '@/lib/api';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@/lib/languages';
import type { MarkdownFile, RepositoryInfo } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const DEFAULT_INSTALLATION_ID =
  process.env.NEXT_PUBLIC_GITHUB_INSTALLATION_ID ?? '123456';
const GITHUB_APP_INSTALL_URL =
  process.env.NEXT_PUBLIC_GITHUB_APP_INSTALL_URL ?? '#';

function splitRepository(fullName: string) {
  const [owner, repo] = fullName.split('/');
  return { owner, repo };
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function pickInitialFiles(files: MarkdownFile[]) {
  const defaultReadme = files.find(
    (file) => file.isDefaultReadme && file.disabledReason === null,
  );
  const firstAvailable = files.find((file) => file.disabledReason === null);
  return [defaultReadme ?? firstAvailable]
    .filter((file): file is MarkdownFile => Boolean(file))
    .map((file) => file.path);
}

export default function TranslatePage() {
  const router = useRouter();
  const [repositoryInput, setRepositoryInput] = useState('');
  const [repository, setRepository] = useState<RepositoryInfo | null>(null);
  const [files, setFiles] = useState<MarkdownFile[]>([]);
  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [isScanning, setIsScanning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedFiles = useMemo(
    () => files.filter((file) => selectedPaths.includes(file.path)),
    [files, selectedPaths],
  );

  const canSubmit =
    repository !== null &&
    selectedPaths.length > 0 &&
    language !== '' &&
    !isSubmitting;

  const handleScan = useCallback(async () => {
    const input = repositoryInput.trim();
    if (!input || isScanning) return;

    setIsScanning(true);
    setError(null);
    setRepository(null);
    setFiles([]);
    setSelectedPaths([]);

    try {
      const resolved = await resolveRepository({
        input,
        installationId: DEFAULT_INSTALLATION_ID,
      });
      const { owner, repo } = splitRepository(resolved.fullName);
      const markdownFiles = await getMarkdownFiles({
        owner,
        repo,
        installationId: DEFAULT_INSTALLATION_ID,
        language,
      });

      setRepository(resolved);
      setFiles(markdownFiles);
      setSelectedPaths(pickInitialFiles(markdownFiles));
    } catch (err) {
      setError(err instanceof Error ? err.message : '扫描仓库失败');
    } finally {
      setIsScanning(false);
    }
  }, [isScanning, language, repositoryInput]);

  const handleToggleFile = useCallback((path: string, checked: boolean) => {
    setSelectedPaths((current) => {
      if (checked) return [...new Set([...current, path])];
      return current.filter((item) => item !== path);
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || repository === null) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await submitTranslationTask({
        installationId: DEFAULT_INSTALLATION_ID,
        repository: repository.fullName,
        baseBranch: repository.defaultBranch,
        files: selectedPaths,
        language,
      });
      router.push(`/tasks/${response.taskId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失败');
    } finally {
      setIsSubmitting(false);
    }
  }, [canSubmit, language, repository, router, selectedPaths]);

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <GitPullRequest data-icon="inline-start" />
            <span className="text-sm font-medium">Global Translate</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary">GitHub App 已配置</Badge>
            <Button asChild variant="outline" size="sm">
              <a href={GITHUB_APP_INSTALL_URL}>安装 GitHub App</a>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
        <section className="flex max-w-2xl flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-normal">
            GitHub 文档翻译
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            输入仓库地址，扫描可翻译的 Markdown 文件，然后选择语言并提交翻译任务。
          </p>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>扫描仓库</CardTitle>
            <CardDescription>
              支持 owner/repo 或 GitHub 仓库 URL。扫描结果只展示可翻译文件。
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="repository-input">仓库地址</FieldLabel>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    id="repository-input"
                    value={repositoryInput}
                    onChange={(event) => setRepositoryInput(event.target.value)}
                    placeholder="输入 GitHub 仓库地址，例如 owner/repo"
                    disabled={isScanning}
                  />
                  <Button
                    type="button"
                    onClick={handleScan}
                    disabled={!repositoryInput.trim() || isScanning}
                  >
                    {isScanning ? (
                      <Loader2 data-icon="inline-start" />
                    ) : (
                      <Search data-icon="inline-start" />
                    )}
                    {isScanning ? '扫描中' : '扫描文件'}
                  </Button>
                </div>
                <FieldDescription>
                  当前安装 ID：{DEFAULT_INSTALLATION_ID}
                </FieldDescription>
              </Field>
            </FieldGroup>

            {error && (
              <Alert variant="destructive">
                <AlertTitle>请求失败</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {repository && (
              <Alert>
                <AlertTitle>仓库已通过授权校验</AlertTitle>
                <AlertDescription>
                  {repository.fullName} · 默认分支 {repository.defaultBranch}
                </AlertDescription>
              </Alert>
            )}

            {files.length > 0 && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-base font-medium">可翻译文件</h2>
                    <p className="text-sm text-muted-foreground">
                      已选择 {selectedFiles.length} 个文件
                    </p>
                  </div>
                  <Badge variant="outline">{files.length} 个 Markdown 文件</Badge>
                </div>

                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10" />
                        <TableHead>文件</TableHead>
                        <TableHead>大小</TableHead>
                        <TableHead>输出路径</TableHead>
                        <TableHead>状态</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {files.map((file) => {
                        const checked = selectedPaths.includes(file.path);
                        const disabled = file.disabledReason !== null;

                        return (
                          <TableRow key={file.path}>
                            <TableCell>
                              <Checkbox
                                aria-label={file.path}
                                checked={checked}
                                disabled={disabled}
                                onCheckedChange={(value) =>
                                  handleToggleFile(file.path, value === true)
                                }
                              />
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {file.path}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatSize(file.sizeBytes)}
                            </TableCell>
                            <TableCell className="font-mono text-sm text-muted-foreground">
                              {file.targetPathPreview}
                            </TableCell>
                            <TableCell>
                              {file.disabledReason ? (
                                <Badge variant="destructive">
                                  {file.disabledReason}
                                </Badge>
                              ) : file.targetExists ? (
                                <Badge variant="secondary">目标文件已存在</Badge>
                              ) : (
                                <Badge variant="outline">可翻译</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                <Separator />

                <FieldGroup>
                  <Field>
                    <FieldLabel>目标语言</FieldLabel>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-full sm:w-72">
                        <SelectValue placeholder="选择目标语言" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {SUPPORTED_LANGUAGES.map((item) => (
                            <SelectItem key={item.code} value={item.code}>
                              {item.label} ({item.code})
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FieldDescription>
                      后端会按语言生成目标文件路径，不覆盖原始文件。
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              所有变更都会通过 Pull Request 提交审核。
            </p>
            <Button type="button" disabled={!canSubmit} onClick={handleSubmit}>
              {isSubmitting && <Loader2 data-icon="inline-start" />}
              {isSubmitting ? '提交中' : '提交翻译任务'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
