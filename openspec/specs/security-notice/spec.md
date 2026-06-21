# security-notice Specification

## Purpose
TBD - created by archiving change security-notice-component. Update Purpose after archive.
## Requirements
### Requirement: Security notice displays no-overwrite guarantee
The system SHALL display a visible notice on the translation page stating that original files will not be overwritten.

#### Scenario: User sees no-overwrite notice
- **WHEN** user visits the translation page
- **THEN** the page displays the text `不会覆盖原始文件`

### Requirement: Security notice displays PR-only workflow
The system SHALL display a visible notice on the translation page stating that all changes go through Pull Request review.

#### Scenario: User sees PR-only notice
- **WHEN** user visits the translation page
- **THEN** the page displays the text `所有变更通过 Pull Request 审核`

### Requirement: Security notice displays token protection
The system SHALL display a visible notice that sensitive credentials are not processed by the frontend.

#### Scenario: User sees token protection notice
- **WHEN** user visits the translation page
- **THEN** the page displays information that tokens/credentials are not handled by frontend

### Requirement: Error message for unauthorized repository
The system SHALL display a user-readable error message when the backend returns an unauthorized repository error.

#### Scenario: Backend returns unauthorized error
- **WHEN** backend returns `repository_not_installed` error
- **THEN** UI displays a message indicating the repository is not authorized for translation

### Requirement: Error message for path safety violation
The system SHALL display a user-readable error message when the backend returns a path safety error.

#### Scenario: Backend returns path error
- **WHEN** backend returns a path traversal or invalid path error
- **THEN** UI displays a message indicating the file path is not allowed

### Requirement: Error message for size limit exceeded
The system SHALL display a user-readable error message when the backend returns a size limit error.

#### Scenario: Backend returns size limit error
- **WHEN** backend returns a file size or task size limit error
- **THEN** UI displays a message indicating the translation task exceeds size limits

