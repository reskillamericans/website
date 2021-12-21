+++
draft = true
+++

# WARNING: Note to Webmaster

**The videos in this folder are all generated automatically.**

If you need to edit front matter - do so in: /data/video-metadata.toml

## Video update process

This repo includes content files that are generated from YouTube video
files from our [YouTube Channel](https://www.youtube.com/c/ReskillAmericans).

Data is stored in two files in the data directory:

- `youtube-videos.json`<br>
  This is all updated via the YouTube data api.  It contains data
  on all our uploaded videos and playlists.  Refresh this information
  by running `get-video-data.mjs`.  *You will need an api-key to
  do this. Run `api-keys-update --decrypt` if you have the password
  for the shared (secret) api key.*
- `video-metadata.toml`<br>
  This file can be updated by running `update-video-metadata.mjs`.
  This will grab any updated information from `youtube-videos.json`
  and create new metadata block for new videos - or update any
  missing metadata for already listed videos (if will NOT EVER
  change any metadata that has been hand-edited here).<br>
  ***But warning: comments in this file will be stripped by running this command.***

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
