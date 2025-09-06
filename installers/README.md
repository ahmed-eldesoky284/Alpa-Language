Alpa installers

The previous `alpa-installer.dmg` in this folder was corrupted and has been removed.

Recommended install paths for macOS users

1) VSIX (recommended for the VS Code extension)

- Build or download the VSIX: `vscode-alpa-0.0.3.vsix` located in `vscode-alpa/`.
- Install via command line:

```bash
code --install-extension /path/to/vscode-alpa-0.0.3.vsix
```

- Or in VS Code: Extensions → ... → Install from VSIX...

2) Use the included helper script

- The script `install-macos.sh` in this folder will attempt to install the VSIX automatically if the `code` CLI is available.

3) Creating a proper signed installer

- If you require a .dmg or .pkg without Gatekeeper warnings, you must create and sign it using an Apple Developer account. That step is not performed here.

If you want, I can recreate a valid `.dmg` that contains a small installer script, but note that unsigned DMGs may still show a Gatekeeper warning on macOS.
