## ADDED Requirements

### Requirement: Target path preview
`src/lib/targetPath.ts` SHALL export a function `getTargetPath(sourcePath: string, language: string): string` that computes the translated file's target path using the same-directory language suffix convention.

#### Scenario: README.md with zh-CN
- **WHEN** `getTargetPath("README.md", "zh-CN")` is called
- **THEN** the result is `"README.zh-CN.md"`

#### Scenario: Nested markdown file
- **WHEN** `getTargetPath("docs/guide.md", "ja")` is called
- **THEN** the result is `"docs/guide.ja.md"`

#### Scenario: .markdown extension
- **WHEN** `getTargetPath("CHANGELOG.markdown", "zh-CN")` is called
- **THEN** the result is `"CHANGELOG.zh-CN.markdown"`

### Requirement: MarkdownFilePicker displays file list
`MarkdownFilePicker` SHALL render a checkbox list of Markdown files provided via props, showing each file's path, size, and target path preview.

#### Scenario: Render file list
- **WHEN** the component receives a list of 3 files
- **THEN** it renders 3 checkbox items, each displaying the file path and size

#### Scenario: Show target path preview
- **WHEN** a file has a `target_path_preview` field
- **THEN** the component displays the target path preview next to the source path

### Requirement: README default selection
`MarkdownFilePicker` SHALL auto-select the file where `is_default_readme` is true when the component mounts or when the file list changes.

#### Scenario: README auto-selected
- **WHEN** the component receives a file list where one file has `is_default_readme: true`
- **THEN** that file's checkbox is checked by default

#### Scenario: No README in list
- **WHEN** no file has `is_default_readme: true`
- **THEN** no file is auto-selected

### Requirement: Disabled files show reason
`MarkdownFilePicker` SHALL disable selection for files with a non-null `disabled_reason` and display the reason inline.

#### Scenario: File with disabled reason
- **WHEN** a file has `disabled_reason: "File exceeds 200KB limit"`
- **THEN** the checkbox is disabled and the reason text is visible

#### Scenario: File without disabled reason
- **WHEN** a file has `disabled_reason: null`
- **THEN** the checkbox is enabled and interactive

### Requirement: Selection count and total size display
`MarkdownFilePicker` SHALL display the current selected file count and total selected size in bytes.

#### Scenario: Show selection summary
- **WHEN** user selects 3 files totaling 50,000 bytes
- **THEN** the component displays "3 files selected" and the total size

#### Scenario: No files selected
- **WHEN** no files are selected
- **THEN** the component displays "0 files selected"

### Requirement: Maximum 10 file selection limit
`MarkdownFilePicker` SHALL prevent selecting more than 10 files. When 10 files are already selected, remaining unchecked files SHALL be disabled.

#### Scenario: At limit
- **WHEN** 10 files are already selected
- **THEN** all unchecked file checkboxes become disabled

#### Scenario: Below limit
- **WHEN** fewer than 10 files are selected
- **THEN** unchecked file checkboxes remain enabled

### Requirement: target_exists warning
`MarkdownFilePicker` SHALL display a non-blocking warning when a file's `target_exists` field is true, indicating the target file already exists.

#### Scenario: Target file exists
- **WHEN** a file has `target_exists: true`
- **THEN** a warning indicator is shown but the file remains selectable

#### Scenario: Target file does not exist
- **WHEN** a file has `target_exists: false`
- **THEN** no warning indicator is shown
