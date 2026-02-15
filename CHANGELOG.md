# Changelog

All notable changes to this project will be documented in this file.

## [0.1.1] - 2025-02-15

### Changed

- Updated README with npm installation instructions
- Fixed GitHub repository URLs in package.json

## [0.1.0] - 2025-02-15

### Added

- Initial release
- Email commands: `send`, `send-batch`, `get`, `update`, `cancel`
- Domain commands: `create`, `list`, `get`, `update`, `delete`, `verify`
- API key commands: `create`, `list`, `delete`
- Audience commands: `create`, `list`, `get`, `delete`
- Contact commands: `create`, `list`, `get`, `update`, `delete`
- Broadcast commands: `create`, `list`, `get`, `update`, `send`, `delete`
- JSON output for all commands
- API key resolution from `--api-key` flag, `RESEND_API_KEY` env var, or `~/.resend_api_key` file
