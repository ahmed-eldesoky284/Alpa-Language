# Alpa Language VSCode Extension

This is a minimal VSCode extension providing basic syntax highlighting and language configuration for the Alpa language.

![screenshot](./images/screenshot.png)

How to run locally:
1. Open this folder in VSCode.
2. Press F5 to launch the Extension Development Host.
3. Open a file with extension `.alpa` to see syntax highlighting.

Commands included:


Keybinding:

This extension aims to give you a pleasant editing experience for the Alpa programming language.

## About Alpa

Alpa is a small, educational language used in this project for demos and teaching. The VSCode extension focuses on editor ergonomics: syntax highlighting, semantic tokens, CodeLens run buttons above `func` declarations, and a small integration that runs `print(...)` calls from the file through a local runner.

## Features

- Syntax highlighting (TextMate grammar + semantic tokens)
- Theme optimized for Alpa files
- File icon for `.alpa` files (enable when prompted)
- CodeLens "Run" above `func` definitions to run the file or a specific function (uses the repository `tools/run-alpa.cjs` runner)
- Snippet insertion and a small demo command

## Install locally on macOS

1. Build a VSIX from the extension folder (requires `vsce`):

```bash
# from the `vscode-alpa` folder
npm install -g vsce
npm run package
```

2. In Finder, double-click the generated `vscode-alpa-0.0.3.vsix` to open in VS Code, or use the command line:

```bash
code --install-extension vscode-alpa-0.0.3.vsix
```

3. If macOS blocks the install or Safari/Downloads shows a security warning, right-click the .vsix and choose "Open" or install from within VS Code (Extensions view -> ... -> Install from VSIX...).

## Publishing to the Marketplace

1. Create a publisher and get a Personal Access Token (PAT) from the Visual Studio Marketplace.
2. Install `vsce` and run:

```bash
npm install -g vsce
vsce login <publisher>
vsce publish
```

See Visual Studio Code docs for packaging and publishing if you need guidance.

## Troubleshooting macOS install issues

- If the VSIX install fails with permission or code-signing errors, install via the `code` CLI (`code --install-extension`) instead — it bypasses macOS Gatekeeper UI.
- If the extension activates but CodeLens doesn't appear: open the `Alpa Runner` output channel (View > Output) and check for errors.
- If file icons don't appear, accept the prompt to enable the Alpa File Icons theme or set `workbench.iconTheme` to `alpa-file-icons` in Settings.

## Notes

This extension ships a small helper runner (`tools/run-alpa.cjs`) that extracts `print(...)` calls; it's not a full interpreter. If you want a proper runtime, we can add a small interpreter later.

If you want, I can build the VSIX here and attach it in the repo, or prepare a Marketplace-ready release (I will need your publisher name and PAT to publish).
