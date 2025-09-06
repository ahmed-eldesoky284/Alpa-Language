# Alpa Language Terminal

[![Deploy to GitHub Pages](https://github.com/YOUR_USERNAME/YOUR_REPONAME/actions/workflows/deploy.yml/badge.svg)](https://YOUR_USERNAME.github.io/YOUR_REPONAME/)

This is a web-based terminal simulator for the Alpa programming language.

> **Note:** Before you begin, please replace `YOUR_USERNAME` and `YOUR_REPONAME` in this README and in the `config.ts` file with your actual GitHub username and repository name.

## Deployment to GitHub Pages

This project is configured for easy, automated deployment to GitHub Pages.

### How it Works

A GitHub Actions workflow located in `.github/workflows/deploy.yml` is set up to automatically deploy your project whenever you push changes to the `main` branch.

### Setup Steps

1.  **Push your code:** Make sure all your latest code is pushed to the `main` branch of your GitHub repository.

2.  **Enable GitHub Pages:**
    *   Go to your repository on GitHub.
    *   Click on the **Settings** tab.
    *   In the left sidebar, click on **Pages**.
    *   Under "Build and deployment", for the **Source**, select **GitHub Actions**.

3.  **Wait for Deployment:** The first deployment will trigger automatically after you've configured the Pages source. You can monitor its progress in the **Actions** tab of your repository.

4.  **Access Your Site:** Once the deployment is complete, your website will be live at `https://<YOUR_USERNAME>.github.io/<YOUR_REPOSITORY_NAME>/`.

### Setting Up Download Links

The application includes download buttons for Windows, macOS, and Linux. For these to work, you need to:

1.  **Update `config.ts`:** 
    *   Open the `config.ts` file.
    *   Replace `'YOUR_USERNAME'` in the `GITHUB_USERNAME` constant with your actual GitHub username.
    *   If your repository is not named `alpa-lang`, replace `'alpa-lang'` in the `GITHUB_REPONAME` constant with its correct name.

2.  **Create a Release:** 
    *   Go to the **Releases** section of your GitHub repository (on the main page, right sidebar) and create a new release (e.g., `v1.0.0`).

3.  **Upload Assets:** 
    *   When creating the release, upload your compiled application files. **The file names must match** the ones in the `config.ts` URLs:
    *   `alpa-installer.exe`
    *   `alpa-installer.dmg`
    *   `alpa-installer.deb`
    *   Publish the release.

Alternatively, for quick testing or to include installers directly in the repository, this repo now includes placeholder installer files under `installers/`:

* `installers/alpa-installer.exe`
* `installers/alpa-installer.dmg`
* `installers/alpa-installer.deb`

Replace these placeholders with your real binaries before publishing or deploying the site.

Now, the download buttons on your live website will point directly to these files.
