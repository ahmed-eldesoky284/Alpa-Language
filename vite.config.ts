import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');

    // Determine Vite `base` automatically for GitHub Pages.
    // If running in GitHub Actions, GITHUB_REPOSITORY is like "owner/repo".
    // For user/organization pages (repo === `${owner}.github.io`) we use '/'.
  // Default to relative paths so the site works when deployed to a subpath (GitHub Pages)
  let base = './';
    const ghRepo = process.env.GITHUB_REPOSITORY || '';
    if (ghRepo) {
      const repoName = ghRepo.split('/')[1] || '';
      if (repoName && !repoName.endsWith('.github.io')) {
        base = `/${repoName}/`;
      }
    }

    return {
      base,
      build: {
        rollupOptions: {
          external: [
            '@mediapipe/face_mesh',
            '@mediapipe/face_detection',
            '@mediapipe/drawing_utils',
            '@mediapipe/camera_utils',
            '@mediapipe/control_utils',
            '@mediapipe/solution_base',
            '@mediapipe/blazeface'
          ]
        }
      },
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
