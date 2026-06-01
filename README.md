# K12 Study Buddy

This repo contains a GitHub-friendly Vite rebuild of a Base44 app.

## Setup

1. Install dependencies:
   `npm.cmd install`
2. Copy `.env.example` to `.env.local`
3. Fill in your Base44 values:
   - `VITE_BASE44_APP_ID`
   - `VITE_BASE44_APP_BASE_URL`
   - `VITE_BASE44_FUNCTIONS_VERSION` (optional)
4. Start the app:
   `npm.cmd run dev`

## Notes

- The app calls `base44.integrations.Core.InvokeLLM`, so it still depends on your Base44 backend being configured.
- The connected GitHub account in this session currently has read-only access to `jsumsart/k12`, so the files were scaffolded locally in `C:\Users\Brittany\OneDrive\Documents\K12`.
