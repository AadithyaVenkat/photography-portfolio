# Fieldnotes

A standalone photo journal for Aadithya Venkatanarayanan. This project is separate from the engineering portfolio.

## Run

Use Node 24 LTS, then run `npm install` and `npm run dev`. The isolated runtime installed for this project is available at `/Users/aadit/.local/share/nodejs/node-v24.22.1-darwin-arm64/bin`; add it to your shell's PATH when using the project. `npm run build` checks TypeScript and creates the static site in `dist/`.

## Edit the journal

In `src/photos.ts`, `photos` contains image metadata, captions, alternative text, and source credits. `journalStories` controls each essay's title, opening passage, interlude, closing note, color treatment, and ordered `photoIds`.

Place your photographs in `public/images/` and use paths such as `images/my-photo.jpg`. Supply accurate dimensions, descriptive alt text, your name and source URL, and set `sample` to `false` for your own work. Replace the illustrative writing with your own stories and update the sample notices in `src/main.ts` once the journal no longer contains sample imagery.

The cover cycles through stories, not individual photographs. Chapter links restore the full journal when a category is selected. Opening an image limits previous/next navigation to that essay's sequence. The viewer supports arrow keys, Escape, and returning focus to the opening button.

The preview uses credited sample photographs from Lorem Picsum / Unsplash and illustrative essays. It does not represent personal travel accounts or photography by Aadithya. External photographs and Google Fonts require an internet connection.