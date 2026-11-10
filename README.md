# Fork the Recipe

A five-star cookie recipe reviewed like a pull request. Made for DIGIHUM 2120 (Digital Creativity), Creative Sprint 9.

Alice Waters wants cooks "inspired by recipes" and not "ruled by them." This page shows the 4.99-star JoyFoodSunshine recipe as the base file and my version as a set of changes. Each change is tagged by where it came from (a reel, my hands, my taste, my own twist) and whether it was a slow or fast choice. A Time tab compares the recipe card's 30 minutes, my one-hour bake and the reel's two-hour brown butter recipe. Waters' own nine principles sit beside it as a second file: even her advice against recipes is a list of rules.

There are no ratings. Visitors can fork any of the three files, change lines, say where each change came from and what they traded for it (time, money, effort), and save the fork to a link. Nothing is stored or sent anywhere; the fork lives in the URL.

## Files

| File | What it does |
|---|---|
| `index.html` | Page structure |
| `style.css` | Layout and diff styling (light and dark) |
| `script.js` | Line diff, comments, filters, time bars, fork editor and share link |
| `recipe.js` | All recipe lines, notes and times (edit this to change the content) |

## Run it locally

Open `index.html` in a browser. No build step or dependencies.

## Publish with GitHub Pages

1. Create an empty public repository on GitHub named `fork-the-recipe` (no README).
2. In this folder, run:
   ```
   git remote add origin https://github.com/thea-ishida/fork-the-recipe.git
   git push -u origin main
   ```
3. On GitHub, open **Settings > Pages**, set **Source** to "Deploy from a branch", choose `main` and `/ (root)`, then **Save**.
4. After a minute the site is live at `https://thea-ishida.github.io/fork-the-recipe/`.

## Credits and notes

- Original recipe: Laura Sandford, "The Best Chocolate Chip Cookie Recipe Ever," JoyFoodSunshine.
- Principles: Alice Waters, *The Art of Simple Food*, Clarkson Potter, 2007, pp. 6-7.
- No outside images, fonts or libraries.
- Code written with assistance from Claude (Anthropic). Text marked STAND-IN in `index.html` and the notes in `recipe.js` were drafted from my answers and are being rewritten in my own words.
