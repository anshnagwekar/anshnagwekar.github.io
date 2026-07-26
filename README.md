# anshnagwekar.github.io

Source for my personal site: [anshnagwekar.github.io](https://anshnagwekar.github.io).

A single static page — no framework, no build step, no dependencies. Edit the files
and push; GitHub Pages serves them as-is.

```
index.html                      the whole page
assets/css/main.css             hand-written CSS (no preprocessor — edit directly)
assets/js/main.js               ~50 lines: scroll reveal + social hover readout
images/                         headshots, background, favicon
NagwekarAnshResumePublic.pdf    résumé
```

## Local preview

```sh
python3 -m http.server 4173
# → http://localhost:4173
```

## Notes

- The design descends from [Identity](https://html5up.net/identity) by HTML5 UP
  (CCA 3.0, see `LICENSE.txt`), but the markup, CSS, and JS have since been rewritten.
- `assets/css/main.css` used to be compiled from SASS. The SASS sources had drifted
  out of sync with the compiled CSS and no longer built anything, so they were removed —
  `main.css` is now the single source of truth.
