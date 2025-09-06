export interface AppConfig {
  copyright: {
    year: number;
    holder: string;
  };
  downloads: {
    windows: string;
    macos: string;
    linux: string;
    vscode_extension_marketplace: string;
  };
}

// TODO: Replace with your GitHub username and repository name for the download links to work.
const GITHUB_USERNAME = 'ahmed-eldesoky284';
const GITHUB_REPONAME = 'Alpa-Language';
// Use the "latest" release URL so the site links to the most recent uploaded release assets.
// When you publish a new release, upload these three files as release assets with the exact names
// `alpa-installer.exe`, `alpa-installer.dmg`, `alpa-installer.deb`.
export const config: AppConfig = {
  copyright: {
    year: 2025,
    holder: 'Ahmed Eldesoky',
  },
  downloads: {
  // Point to the helper installer scripts or VSIX in the repository to avoid broken binary images
  windows: `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPONAME}/main/installers/install-windows.bat`,
  macos: `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPONAME}/main/vscode-alpa/vscode-alpa-0.0.3.vsix`,
  linux: `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPONAME}/main/installers/install-linux.sh`,
  vscode_extension_marketplace: 'https://marketplace.visualstudio.com/items?itemName=AlpaLanguage.vscode-alpa',
  },
};
