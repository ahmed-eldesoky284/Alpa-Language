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
    windows: `https://github.com/${GITHUB_USERNAME}/${GITHUB_REPONAME}/releases/latest/download/alpa-installer.exe`,
    macos: `https://github.com/${GITHUB_USERNAME}/${GITHUB_REPONAME}/releases/latest/download/alpa-installer.dmg`,
    linux: `https://github.com/${GITHUB_USERNAME}/${GITHUB_REPONAME}/releases/latest/download/alpa-installer.deb`,
  vscode_extension_marketplace: 'https://marketplace.visualstudio.com/items?itemName=AlpaLanguage.vscode-alpa',
  },
};
