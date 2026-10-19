# Sugar Plum
Run: `npm install` then `npm run dev` (open the printed URL). Build: `npm run build`.
- **All personal content:** `src/data/loveStory.js` (dialogue, memories, 12 reasons, letters, food dishes, song info, final letter).
- **Photos:** drop files in `public/memories/` (memory1.jpg ... memory5.jpg) and set `photo`/`caption` per memory in loveStory.js. Missing photos show an elegant placeholder.
- **Song:** put the file at `public/music/our-song.mp3`. Set `song.title` and `song.artist` in loveStory.js. Cover art: `public/images/song-cover.jpg`. Until the file exists, the player shows "still being made".
- **Deploy:** push to GitHub, import into Vercel or Netlify (build `npm run build`, output `dist`). Or `npx vercel` / drag `dist` into Netlify Drop.
- Add real dishes in the `food` memory's `dishes` array. Voice-message audio is disabled until you add files.
