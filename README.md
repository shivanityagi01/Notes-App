# Notes App

A modern, responsive Notes Management Application built with React, Tailwind CSS, and React Router. Notes are stored locally in the browser using `localStorage`, so your data persists across page refreshes without a backend.

## Project Description

This application helps you create, organize, and manage personal notes. You can pin important notes, archive notes you want to keep but hide from the main list, move notes to Trash, restore them later, or delete them permanently. Search and tag filters make it easy to find what you need quickly.

## Features

- Create, view, edit, and delete notes
- Search notes by title and content (case-insensitive)
- Assign multiple tags to notes
- Filter notes by tag
- Combine search and tag filtering
- Pin and unpin notes (pinned notes appear at the top)
- Archive and unarchive notes
- Move notes to Trash
- Restore notes from Trash
- Permanently delete notes with confirmation
- Persist all notes in `localStorage`
- Responsive layout for desktop, tablet, and mobile
- Friendly empty states for every page

## Technologies Used

- React JS
- Vite
- Tailwind CSS
- React Router DOM
- Browser `localStorage`
- JavaScript / JSX

## Installation

1. Open a terminal in the project folder (`vite-project`).
2. Install dependencies:

```bash
npm install
```

If you are setting up dependencies manually from scratch, also run:

```bash
npm install react-router-dom
npm install -D tailwindcss @tailwindcss/vite
```

## Running Locally

Start the development server:

```bash
npm run dev
```

Then open the local URL shown in the terminal (usually `http://localhost:5173`).

## Build Command

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```text
vite-project/
├── index.html
├── package.json
├── vite.config.js
├── public/
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── components/
    │   ├── ConfirmModal.jsx
    │   ├── EmptyState.jsx
    │   ├── Navbar.jsx
    │   ├── NoteCard.jsx
    │   ├── NoteForm.jsx
    │   ├── NoteModal.jsx
    │   ├── NotesList.jsx
    │   ├── SearchBar.jsx
    │   ├── Sidebar.jsx
    │   └── TagFilter.jsx
    ├── pages/
    │   ├── Archive.jsx
    │   ├── Notes.jsx
    │   ├── Pinned.jsx
    │   └── Trash.jsx
    └── utils/
        ├── noteHelpers.js
        └── storage.js
```

## localStorage Explanation

All notes are saved under a single key:

```text
notes-app-data
```

On startup, the app reads this key from `localStorage`. If the key is missing or contains invalid JSON, the app starts with an empty notes array and continues without crashing.

Whenever notes are created, edited, pinned, archived, restored, moved to Trash, or permanently deleted:

1. React state is updated
2. The updated notes array is written back to `localStorage`

Refreshing the browser keeps your notes available because they are loaded from `localStorage` on app start.

## Routes

| Path       | Page           |
| ---------- | -------------- |
| `/`        | Notes          |
| `/pinned`  | Pinned notes   |
| `/archive` | Archived notes |
| `/trash`   | Trash          |

## Deployment Instructions

### GitHub

1. Initialize git if needed and commit your project.
2. Create a GitHub repository.
3. Push the project:

```bash
git add .
git commit -m "Initial notes app"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### Netlify

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Deploy using the Netlify UI, CLI, or continuous deployment from GitHub.

Example with Netlify CLI:

```bash
npm run build
npx netlify deploy --prod --dir=dist
```

### Render

1. Create a Static Site on Render.
2. Connect your GitHub repository.
3. Build command: `npm run build`
4. Publish directory: `dist`

After deployment, open the live URL and verify create, edit, search, pin, archive, trash, restore, and permanent delete flows.

## License

This project is provided for learning and portfolio use.
