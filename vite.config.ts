import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');

    // Determine Vite `base` automatically for GitHub Pages.
    // If running in GitHub Actions, GITHUB_REPOSITORY is like "owner/repo".
    // For user/organization pages (repo === `${owner}.github.io`) we use '/'.
    let base = '/';
    const ghRepo = process.env.GITHUB_REPOSITORY || '';
    if (ghRepo) {
      const repoName = ghRepo.split('/')[1] || '';
      if (repoName && !repoName.endsWith('.github.io')) {
        base = `/${repoName}/`;
      }
    }

    return {
      base,
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
