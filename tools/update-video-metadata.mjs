#!/bin/env node
// update-video-metadata.mjs --- Add entries to data/video-metadata.toml

import { mkdir, readFile, writeFile } from 'fs/promises';
import slugify from 'slugify';
import { exit, argv } from 'process';
import TOML from '@iarna/toml';

const sourceFile = 'data/youtube-videos.json';
const metadataFile = 'data/video-metadata.toml';

let verbose = false;
let force = false;

for (let arg of process.argv.slice(2)) {
  if (arg === '--verbose') {
    verbose = true;
  } else if (arg === '--force') {
    force = true;
  } else {
    console.error(`Unknown argument: ${arg}`);
    exit(1);
  }
}

//
// Convert our dataset to markdown files describing each video
//
const {videos, playlists} = await readFile(sourceFile, 'utf8')
  .then(JSON.parse);

console.log(`There are ${videos.length} videos and ${playlists.length} playlists in ${sourceFile}.`);

const tags = getPlaylistsTags(videos, playlists);

const metadata = await readFile(metadataFile, 'utf8')
  .then(TOML.parse)
  .catch(() => { return {}; });

let changed = false;

// Only add to videos w/o current metadata
for (let video of videos) {
  const {videoId} = video.contentDetails;
  if (!force && metadata[videoId] !== undefined) {
    continue;
  }
  console.log("Adding metadata for " + video.snippet.title);
  changed = true;
  metadata[videoId] = getFrontMatter(video, tags[videoId]);
}

if (changed) {
  console.log("Writing updated metadata to " + metadataFile);
  writeFile(metadataFile, TOML.stringify(metadata));
} else {
  console.log("No new video files.");
}

// Object with videoId keys and array of slugified tags as values
function getPlaylistsTags(videos, playlists) {
  const videoMap = new Map();
  const videoTags = {};

  for (let video of videos) {
    videoMap.set(video.contentDetails.videoId, video);
  }

  for (let playlist of playlists) {
    const tag = slugify(playlist.title, {lower: true, strict: true});

    for (let videoId of playlist.videos) {
      const video = videoMap.get(videoId);

      if (videoTags[videoId] === undefined) {
        videoTags[videoId] = [];
      }
      videoTags[videoId].push(tag);
    }
  }

  if (verbose) {
    for (let video of videos) {
      const tags = videoTags[video.contentDetails.videoId];
      if (tags === undefined) {
        console.warn(`${video.snippet.title} is not in any playlist`);
      } else if (tags.length > 1) {
        console.warn(`${video.snippet.title} is in multiple playlists: ${tags.join(', ')}`);
      }
    }
  }

  return videoTags;
}

// Front matter includes:
//
// title = "Virtual Job Fair #1 | Software One"
// guest = "Nina Unger"
// guestTitle = "Software One"
// slug = "job-fair-1-software-one"
// date = "2021-08-19T07:29:26Z"
// draft = false
// tags = ['job-fair', 'companies']
// videoID = 'RLX-6YJHubg'
function getFrontMatter(video, tags) {
  const {snippet, statistics, contentDetails, liveStreamingDetails} = video;
  const {videoId, videoPublishedAt} = contentDetails;
  const {title} = snippet;

  const date = new Date(liveStreamingDetails?.actualStartTime || videoPublishedAt);

  const {num, guestName, guestTitle} = parseTitle(title);

  const slug = slugify(title, {lower: true, strict: true});
  let filename = `${date.toISOString().slice(0, 10)}-${videoId}.md`;

  return {
    title,
    guest: guestName,
    guestTitle,
    slug,
    num,
    filename,
    date: date.toISOString(),
    draft: false,
    tags
  };
}

// Video title format: "Event name #N | Guest Name - Guest Title"
// Returns {num, guestName, guestTitle}
function parseTitle(title) {
  let num;
  let guest;
  let guestName;
  let guestTitle;

  const matches = title.matchAll(/^.* \#(?<num>\d+)?(\s+\|\s+(?<guest>.*))?/g);
  const match = [...matches][0];

  if (match) {
    ({num, guest} = match.groups);
  }

  guestName = guest;
  if (guest) {
    const parts = guest.split('-').map(s => s.trim());
    [guestName, guestTitle] = parts;
  }

  return {num, guestName, guestTitle};
}
