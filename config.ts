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
export const config: AppConfig = {
  copyright: {
    year: 2025,
    holder: 'Ahmed Eldesoky',
  },
  downloads: {
    windows: `./installers/alpa-installer.exe`,
    macos: `./installers/alpa-installer.dmg`,
    linux: `./installers/alpa-installer.deb`,
  vscode_extension_marketplace: 'https://marketplace.visualstudio.com/items?itemName=AlpaLanguage.vscode-alpa',
  },
};
