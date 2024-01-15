<!-- Make sure you overwrite all the contents of this readme file with yours on your real project! -->

# <img src=".github/media/logo.png" alt="Logo" width="520px">

<!-- [![GitHub Workflow Status](https://img.shields.io/github/workflow/status/phoenix-islands/phoenix-islands-js/Release?style=flat-square)](https://github.com/phoenix-islands/phoenix-islands-js/actions/workflows/release.yml) -->

**Phoenix Islands** is a library for creating islands of various frontend frameworks in Phoenix LiveView.

## Features

- **Live Islands**: We can enjoy huge front-end ecosystem without losing Liveliness. We start with React for now but we can go as far as all framework that [nanostore](https://github.com/nanostores/nanostores) supports in the near future.
- **Stream support**: That means no more giant JSON eating up server memory.
- **LiveView childresn passing (Experimental)**: LiveView inside React inside Live-View.

## Packages

| Package                 | Description                        | Version (click for changelog)          |
| :---------------------- | :--------------------------------- | :------------------------------------- |
| [core](packages/core)   | Based phoenix live-view hook logic | [v0.1.12](packages/core/changelog.md)  |
| [data](packages/data)   | Vanilla JS adapter                 | [v0.1.12](packages/data/changelog.md)  |
| [react](packages/react) | React adapter                      | [v0.1.12](packages/react/changelog.md) |

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
