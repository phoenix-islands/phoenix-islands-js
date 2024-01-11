<!-- Make sure you overwrite all the contents of this readme file with yours on your real project! -->

# <img src=".github/media/logo.png" alt="Logo" width="520px">

<!-- [![GitHub Workflow Status](https://img.shields.io/github/workflow/status/phoenix-islands/phoenix-islands-js/Release?style=flat-square)](https://github.com/phoenix-islands/phoenix-islands-js/actions/workflows/release.yml) -->

**Phoenix Islands** is a library for creating islands of various frontend framework in Phoenix LiveView.

## Features

- **Fast and Lightweight**: Utilizes native NPM workspaces for optimal performance without unnecessary bloat.
- **Automated Releases**: Automatically triggers GitHub releases and NPM publishing for each package after a `git push`.
- **Changelog Updates**: Automatically updates changelogs for each package after a `git push`.
- **Dependency Management**: Effortlessly manage and update dependencies within the monorepo.
- **Multilingual Support**: Develop packages with mixed languages within a single repository.
- **Modern Code**: Embrace the latest syntax and coding practices for increased productivity.
- **Output Formats**: Provides UMD, CommonJS, and ESM output formats for JavaScript packages.
- **Live Playground**: Get a live playground environment ready to experiment with your code.

## Packages

| Package                             | Description                          | Version (click for changelog)                           |
| :---------------------------------- | :----------------------------------- | :------------------------------------------------------ |
| [core](packages/core)               | Based phoenix live-view hook logic   | [v0.0.0-development](packages/core/changelog.md)      |
| [react](packages/react)             | React adapter                        | [v0.0.0-development](packages/react/changelog.md)       |

## Development

To start a new project using Monorepo Starter, you can either **click the "Use this template"** button on GitHub or manually clone the repository. After cloning, navigate to the project directory and install the required dependencies using the following command:

```bash
npm i
```

> This package is pure [ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) and requires Node.js `^12.22 || ^14.17 || >=16.10.0`

### Available Commands

Here are the available commands to manage and build the project:

- `npm start -w pkgName`: Starts the development server and watches for changes for a specific package.
- `npm run dev`: Builds the project using Vite and watches for changes with auto-reloading.
- `npm run build`: Builds the project using Vite for production.
- `npm test`: Runs tests with Vitest and displays a user interface.
- `npm run coverage`: Runs tests with Vitest and generates a coverage report.
- `npm run types`: Generates TypeScript declaration files and resolves TypeScript paths.
- `npm run lint`: Lints the project using ESLint and TypeScript, checking for syntax and code quality issues.
- `npm run format`: Formats the project files using Prettier.

Please note that you can add the `-w` or `--workspace` flag to target one or more specific package(s) when using the above commands:

```bash
npm test -w pkgName
npm run build -w pkg1 -w pkg2 ...
```

## License

![GitHub](https://img.shields.io/github/license/phoenix-islands/phoenix-islands-js)
