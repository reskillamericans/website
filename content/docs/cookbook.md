+++
title = "Cookbook\nReskill Americans Website"
date = 2022-01-12
draft = false
layout = "document"
toc = true
+++

*If you are contributing to this site - as a content editor or software
maintainer, this page contains common tasks and how to perform them.*

## Requirements

- A Linux or bash-compatible OS (Mac, GitBash, WSL).
- Node/npm installed (currently Node version 16.x).

## Getting the Source Code

Fork the [repository](https://github.com/reskillamericans/website).

## Building the Site

The tooling for this website is based on Linux - there are several bash scripts
that are used to execute various build, test, and utility commands.  That said,
it can also be used on a Mac or Windows with a bit more manual customization to
install needed tools.

```
$ source tools/use  # Put the tools directory in your PATH.
$ configure         # Only needed for a newly installed repo
                    # or when npm packages updated.
$ lint              # Check code for errors (including Typescript errors)
$ build             # Compile code and build the site pages.
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
[content](https://github.com/reskillamericans/website/tree/main/content)
directory.

*Please format paragraph text to line break at 80 characters.*

We augment some of the features of MarkDown with the addition [Hugo
Shortcodes](https://gohugo.io/content-management/shortcodes/).  The primary ones
you should know about are (see [source
code](https://github.com/reskillamericans/website/tree/main/themes/ra-theme/layouts/shortcodes)
for further reference):

- `{{%/* section */%}}` - This wraps a section of MarkDown and applies some
  optional styles to the section.  Note that all content on our site is wrapped
  in a `<section>` tag, and then within that a `<div class="content">`.
  Together, these provide the styling for the section.  The available section
  class options are:
  - `contrast` - Make the section a dark (black)  background color.
  - `light-background` - A light blue background color.
  - `color-contrast` - A dark-blue background color.
  - `centered` - All text and headings default centered.
  - `wrapped-boxes` - Child divs are highlighted as boxes and wrap in a flex
    container.
  - `team-boxes` - Used on the /about page to show the team members.
  - `prep-overlap` - Added to the section BEFORE a section that will overlap it.
  - `overlap` - Added to the overlapping section.  Content (usually a
    wrapped-boxes or team-boxes section) has a negative top margin so it
    overlaps the previous section.
  - `side-by-side` - Used to show just two children (div or image) side-by-side.
  - `light-box` - Uses a contrasting white box over a light-background section.
- `{{</* image */>}}` - Used to reference an image from the
  [assets/images](https://github.com/reskillamericans/website/tree/main/assets/images)
  directory.  The parameters are:
  - `src` - The file name of the image.
  - `resize` - A sizing instruction.  E.g. `"800x"` would mean resize the image
    to be 800 px wide.  See
    [image processing options](https://gohugo.io/content-management/image-processing/#image-processing-options)
    for all the available options.  Images should be down-scaled when used so
    they are as small as needed.
  - `alt` - Alt text to display for the image.
  - `class` - One of:
    - `hero` - Used for top-of-page images - note images are cropped to maintain
      the desired aspect ratio for hero images.
    - `high` - Along with hero, crops the image higher up than the center.
- `{{%/* image-box */%}}` - Similar to image, but places image at the top of a
  floating box that contains other markdown.
- `{{</* sign-in */>}}` - Placed at the top of any page that requires a user
  sign-in (like a form submission).  It will place a LinkedIn sign-in box there
  if the user is not signed in (and display the current user information if they
  are).
- `{{</* testimonials */>}}` - Custom tag to embed a testimonials carousel.
- `{{</* video-carousel */>}}` - Custom tag that displays a carousel of videos
  that match a given tag (e.g., `{{</* video-carousel partners */>}}`).
- `{{</* team-members */>}}` - Displays a collection of team boxes that match a
  given tag (e.g., `{{</* team-members Team */>}}` or
  `{{</* team-members Advisor */>}}`).

## Uploading an Image

Miscellaneous images are saved in the
[assets/images](https://github.com/reskillamericans/website/tree/main/assets/images)
directory.  You should always upload the highest resolution of the image
available.  When embedding the image with the `{{</* image */>}}` shortcode (see
above) it can be down-scaled to the most appropriate size where it is included
in the site.

## Adding a Testimonial

Testimonials are all stored in the
[content/testimonials](https://github.com/reskillamericans/website/tree/main/content/testimonials)
directory.  The best way to create a new one is to use the hugo command:

```
$ hugo new testimonials/name-of-person
```

This will create a new folder for that person's testimonial.  The `index.md` file
that was created by the testimonial template can now be edited.  A sample looks
like this:

```
+++
title = "Testimonial of Ethel Mertz"
date = 2022-01-12T12:50:21-08:00
draft = false

name = "Ethel Mertz"
location = "City, State"
+++

<insert testimonial text here>
```

Be sure to edit the location *front-matter* and paste in the content of their
quotation as plain text as the body of `index.md`.

You should also upload a profile picture of the person and store it in the same
directory, naming it `profile.jpg`.  Please be sure to save the profile picture
in the maximum resolution available, since Hugo will downscale it appropriately.

In rare cases, we have been given an image that was taken with a rotation in it.
The rescaling process removes that knowledge, and so it will display sideways!
This can be fixed by adding a `rotation` field to the *front-matter*, e.g.:

```
rotation = 270
```

You should build the site and make sure the new testimonial is showing in the
home page carousel.

*You can make the folder manually as well - just be sure to name it
`firstname-lastname` in all lower case (this is the standard slug-text for
a testimonial page).*

## Updating YouTube Video Posts

This repo includes content files that are generated from YouTube video files
from our [YouTube Channel](https://www.youtube.com/c/ReskillAmericans).

The process to update the site from YouTube is:

```
$ api-keys-update --decrypt   # Only once - you need a password for this.
$ get-video-data.mjs          # Updates the data/youtube-videos.json file.
$ update-video-metadata.mjs   # Merge new youtube-data with edited
                              # video-metadata.toml file.
```

If there are extra edits to apply to the *front-matter* of a video, edit the
corresponding fields in the
[data/video-metadata.toml](https://github.com/reskillamericans/website/blob/main/data/video-metadata.toml)
file.  Then re-run `update-video-metadata.mjs`.

### Where video data is stored

Data is stored in two files in the
[data](https://github.com/reskillamericans/website/tree/main/data) directory:

- `youtube-videos.json`<br>
  This is all updated via the YouTube data api.  It contains data
  on all our uploaded videos and playlists.  Refresh this information
  by running `get-video-data.mjs`.  *You will need an api-key to
  do this. Run `api-keys-update --decrypt` if you have the password
  for the shared (secret) api key.*
- `video-metadata.toml`<br>
  This file can be updated by running `update-video-data.mjs`.
  This will grab any updated information from `youtube-videos.json`
  and create new metadata block for new videos - or update any
  missing metadata for already listed videos (if will NOT EVER
  change any metadata that has been hand-edited here).<br>
  ***But warning: comments in this file will be stripped by running this
  command.***

The `create-video-content-files.mjs` command will regenerate ALL the video
content files in the `content/videos` directory by combining the information in
the `video-metadata.toml` file with the `youtube-videos.json` file.

A sample metadata entry for a video looks like this:

```
[g7hCp8is2qg]
title = "Reskill Americans Town Hall #18 | Andrew Kwatinetz and Eric Patey - Sonos"
videoId = "g7hCp8is2qg"
guest = "Andrew Kwatinetz & Eric Patey"
guestTitle = "Sonos"
slug = "town-hall-18-andrew-kwatinetz-eric-patey-sonos"
num = "18"
filename = "2021-08-02-g7hCp8is2qg.md"
date = "2021-08-02T15:01:23.000Z"
draft = false
tags = [ "town-halls" ]
quote = "This is a sample pull-quote for the video."
```

All but the filename will be added to the [Front
Matter](https://gohugo.io/content-management/front-matter/) of the corresponding
Markdown file.
