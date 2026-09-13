# Case study covers

Drop screenshots here and they appear automatically — in the work rail panel
and behind the case study hero.

Name the file to match the `cover` field in `src/content/work.ts`:

| Project | Expected file |
|---|---|
| Orixen Digital | `public/work/orixen-cover.png` |

To add one for another project, set `cover: "/work/<name>.png"` on its entry in
`src/content/work.ts` and put the file here.

A cover that is named but not present is ignored — `src/lib/covers.ts` checks
for the file at build time and falls back to the generated colour field, so an
empty slot never ships a broken image.

Use a wide shot (roughly 16:9 or wider, 1600px+) — both placements crop from
the top.
