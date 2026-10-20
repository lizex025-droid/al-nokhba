# Dynamic course details

All course data stays in `src/lib/specialtyMaterials.ts`. The repository currently has 35 unique courses (50 entries across the four specialties; plus 5 shared requirement entries). Original academic metadata is preserved, not independently validated as official university information. No downloadable course resources were present.

- `allCourses()` aggregates every collection, deduplicates shared courses, and rejects conflicting titles with the same ID.
- `/courses/[courseId]` uses the same template for every course. Existing codes produce stable IDs such as `pt-111`. Supply a stable explicit `id` for courses without a code or where codes collide.
- Faculty and university requirement collections derive from existing classifications. Category cards now link to these directories.
- Add courses to the existing data source. Missing academic fields are omitted; missing descriptions receive a neutral Arabic description derived from the title.
- This project uses Next.js static export. Adding/changing data requires the normal build and deployment; there is no runtime database. No additional page component or route entry is needed.

## Resources

Add a `resources` array to a material, with records conforming to `CourseResource` in `src/lib/courseResources.ts`:

- Required: stable `id`, `title`, actual `url`.
- Optional: `tab` (`summaries`, `slides`, `tests`, `lectures`), `section` (`midterm`, `final`, `extra`), display `type`, actual `downloadUrl`, `interactive`.
- Explicit tab/section metadata overrides name/type/extension inference. Unrecognized files fall under general summaries. PDF alone does not imply slides; use `tab: 'slides'` for ambiguous presentations.
- Only HTTPS and root-relative URLs are accepted. Duplicate URLs count once. Invalid resources are omitted and do not affect the count. Validation checks syntax/protocol, not remote existence.
- Preview/video/test actions open the original resource in a new tab; no third-party content is embedded. Downloads use `downloadUrl` where provided. Cross-origin servers may open a file instead of forcing download; configure their Content-Disposition response or provide a download endpoint if needed.
- Interactive tests require a real test URL; no quiz is fabricated.

## Verification

Run `npm run build`, `npm run typecheck`, and `npm run test:courses` (the test reads exported HTML, so build first).
The verification script covers every catalog entry and metadata field, exported course routes, all four tab/panel markup, current empty states, future data entries, URL safety, deduplication and classification. Synthetic resource fixtures exist only inside tests.

No lint script or linter is configured in the existing repository. Browser-based visual checks, actual tab clicks, history behavior, and live resource downloads were not verified in this environment; no browser tool was available and no real course files exist. Responsive CSS, RTL keyboard controls, native accordion semantics and reduced-motion support are implemented but need browser QA before release.
