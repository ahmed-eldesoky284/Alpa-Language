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
const GITHUB_USERNAME = 'YOUR_USERNAME';
const GITHUB_REPONAME = 'alpa-lang';

export const config: AppConfig = {
  copyright: {
    year: 2025,
    holder: 'Ahmed Eldesoky',
  },
  downloads: {
    windows: `https://github.com/${GITHUB_USERNAME}/${GITHUB_REPONAME}/releases/latest/download/alpa-installer.exe`,
    macos: `https://github.com/${GITHUB_USERNAME}/${GITHUB_REPONAME}/releases/latest/download/alpa-installer.dmg`,
    linux: `https://github.com/${GITHUB_USERNAME}/${GITHUB_REPONAME}/releases/latest/download/alpa-installer.deb`,
    vscode_extension_marketplace: 'https://marketplace.visualstudio.com/items?itemName=alpa-lang.alpa',
  },
};
