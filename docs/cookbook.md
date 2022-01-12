# Reskill Americans Website - Cookbook

If you are contributing to this site - as a content editor or software
maintainer, this page contains common tasks and how to perform them.

# Building the Site

The tooling for this website is based on Linux - there are several bash scripts
that are used to execute various build, test, and utility commands.  That said,
it can also be used on a Mac or Windows with a bit more manual customization to
install needed tools.

## Requirements

- A Linux or bash-compatible OS (Mac, GitBash, WSL).
- Node/npm installed (currently Node version 16.x).

## Building the Site

```
$ source tools/use  # Put the tools directory in your PATH.
$ configure         # Only needed for a newly installed repo
                    # or when npm packages updated.
$ build             # Build the site.
$ run-tests         # Run all acceptance tests.
$ test-server       # Launch a dev server to view the site locally.
```

## Creating a Pull Request

Generally, all updates to the site go through a Pull Request process.  You
either can fork this repo, or, if you have been granted contributor access on
GitHub, just make a new branch for your changes.  Please name your branch
`<username>-<subject>` (e.g., `mckoss-testimonials`) so we can keep track of
what active branches are for.

The GitHub CI will run tests to ensure that the build is successful, and the
generated HTML is valid.  Once a code review by another contributor is done, the
Pull Request can be merged into the `main` branch.

We generally prefer that all code changes are `rebased` rather than `merged` so
we have a linear commit history in the main branch.  Please be sure
that your PR branch is rebased to the HEAD of main before submitting it.

## Editing Content

All the content for the site is stored in
[MarkDown](https://www.markdownguide.org/tools/hugo/) under the
[content](../content) directory.

*Please format paragraph text to line break at 80 characters.*

We augment some of the features of MarkDown with the addition Hugo
[Shortcodes](https://gohugo.io/content-management/shortcodes/).  The primary
ones you should know about are:

- `{{% section %}}` - This wraps a section of MarkDown and applies some optional
  styles to the section.  Note that all content on our site is wrapped in a
  `<section>` tag, and then within that a `<div class="content">`.  Together,
  these provide the styling for the section.  The available section class
  options are (see [source
  code](../themes/ra-theme/layouts/shortcodes/section.html) for details.).
  - `contrast` - Make the section a dark (black)  background color.
  - `light-background` - A light blue background color.
  - `color-contrast` - A dark-blue background color.
  - `centered` - All text and headings default centered.
  - `wrapped-boxes` - Child divs are hightlighted as boxes and wrap in a flex
    container.
  - `team-boxes` - Used on the /about page to show the team members.
  - `prep-overlap` - Added to the section BEFORE a section that will overlap it.
  - `overlap` - Added to the overlapping section.  Content (usually a
    wrapped-boxes or team-boxes section) has a negative top margin so it
    overlaps the previous section.
  - `side-by-side` - Used to show just two children (div or image) side-by-side.
  - `light-box` - Uses a contrasting white box over a light-background section.
- `{{< image >%}}` - Used to reference an image from the [assets](../assets)
  diretory.  The parameters are (see [source
  code](../themes/ra-theme/layouts/shortcodes/image.html)).
  - `src` - The file name of the image.
  - `resize` - A sizing instruction.  E.g. `"800x"` would mean resize the image
    to be 800 px wide.  See [image processing options](https://gohugo.io/content-management/image-processing/#image-processing-options) for all the
    available options.  Images should be down-scaled when used so they are as
    small as needed.
  - `alt` - Alt text to display for the image.
  - `class` - One of:
    - `hero` - Used for top-of-page images - note images are cropped to maintain
      the desired aspect ratio for hero images.
    - `high` - Along with hero, crops the image higher up than the center.
- `{{% image-box %}}` - Similar to image, but places image at the top of a
  floating box that contains other markdown.
- `{{< sign-in >}}` - Placed at the top of any page that requires a user sign-in
  (like a form submission).  It will place a LinkedIn sign-in box there if the
  user is not signed in (and display the current user information if they are).
- `{{< testimonials >}}` - Custom tag to embed a testimonials carousel.
- `{{< video-carousel >}}` - Custom tag that displays a carousel of videos that
  match a given tag (e.g., `{{< video-carousel partners >}}`).
- `{{< team-members >}}` - Displays a collection of team boxes that match a
  given tag (e.g., `{{< team-members Team >}}` or
  `{{< team-members Advisor >}}`).
