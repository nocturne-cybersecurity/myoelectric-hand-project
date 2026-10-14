<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep shared site navigation in the root layout and page content in leaf routes, so each view has independent metadata.
- Load gallery photos from local asset folders with Vite glob imports, so replacing or adding image files does not require external image URLs.
- Isolate the R3F prototype in a lazy component behind ClientOnly; this keeps browser rendering out of SSR and preserves the main page's server-rendered content.
- Keep production-cost presentation in its own component and distinguish purchase prices from per-unit consumption; this prevents misleading totals when switching cost categories.
- Use a bespoke procedural articulated concept for the prosthesis until an exact project CAD asset is supplied; no suitably licensed standalone CC0 prosthetic model was available.
