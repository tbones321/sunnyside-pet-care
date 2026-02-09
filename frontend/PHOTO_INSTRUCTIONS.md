Place your pet photos in the project so they appear in the right-hand photo column.

Preferred (works with Vite dev server):
1. Copy your images into `frontend/src/assets/pet-photos/` (create directories if needed).
   Example Windows path to copy from:
   C:\Users\tonyf\Pictures\Pet photos\mydog.jpg -> frontend/src/assets/pet-photos/mydog.jpg
2. Restart the dev server if it is running.

Notes:
- Supported image formats: .jpg .jpeg .png .gif
- The app uses Vite's `import.meta.glob` to include all files in `src/assets/pet-photos` automatically.
- If no photos are present the sidebar will show a helpful message.
