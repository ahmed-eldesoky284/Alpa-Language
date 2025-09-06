Place platform installer files here before creating a Git tag for release.

Filenames must match these exact names for the site links to work:

- alpa-installer.exe  (Windows)
- alpa-installer.dmg  (macOS)
- alpa-installer.deb  (Linux)
- vscode-alpa-0.0.3.vsix  (VS Code extension)

When you push a tag like `v0.0.3`, the GitHub Actions workflow `publish-release.yml` will:
- build the frontend
- package the VSIX from `vscode-alpa/`
- upload any files in `release-artifacts/` and the generated VSIX to the GitHub Release as assets

Note: For a proper macOS installer that avoids Gatekeeper warnings, you should code-sign the DMG using an Apple Developer ID before adding it here.
