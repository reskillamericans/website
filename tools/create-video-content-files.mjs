#!/bin/env node
// create-video-content-files --- Generate markdown files from video and metadata.

import { mkdir, readFile, writeFile, access } from 'fs/promises';
import { exit } from 'process';
import TOML from '@iarna/toml';
import fetch from 'node-fetch';

const videoFile = 'data/youtube-videos.json';
const metadataFile = 'data/video-metadata.toml';
const targetDir = 'content/videos/';

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
const {videos} = await readFile(videoFile, 'utf8')
  .then(JSON.parse);

const metadata = await readFile(metadataFile, 'utf8')
  .then(TOML.parse);

console.log(`There are ${videos.length} videos ${videoFile}.`);

createVideoBundles(videos, metadata, targetDir);

// Write a markdown file for each video
async function createVideoBundles(videos, metadata, targetDir) {
  let hadError = false;

  for (let video of videos) {
    const {videoId} = video.contentDetails;
    const frontMatter = metadata[videoId];
    if (metadata[videoId] === undefined) {
      console.log(`Missing metadata for ${video.snippet.title}`);
      hadError = true;
      continue;
    }

    const {filename} = frontMatter;
    delete frontMatter[filename];

    if (filename === undefined) {
      console.log(`Missing filename in metadata for ${video.snippet.title}`);
      hadError = true;
      continue;
    }

    const dir = `${targetDir}${filename}/`;

    let markdown = `+++\n${TOML.stringify(frontMatter)}\n+++\n\n`;
    markdown += `${video.snippet.description}\n`;

    console.log(`Creating ${dir}`);

    await mkdir(dir, {recursive: true});
    await writeFile(`${dir}index.md`, markdown);

    const thumbnails = video.snippet.thumbnails;
    const thumbnail = thumbnails.maxres || thumbnails.standard || thumbnails.high;

    if (thumbnail === undefined) {
      console.log(`No thumbnail resolution found for ${video.snippet.title}`);
      hadError = true;
      continue;
    }

    await downloadImage(thumbnail.url, `${dir}/thumbnail.jpg`);
  }

  if (hadError) {
    console.log("Run update-video-metadata.mjs to update metadata for all videos.");
    exit(1);
  }
}

async function downloadImage(url, filepath) {
  const exists = await access(filepath)
    .then(() => true)
    .catch(() => false);

  if (!force && exists) {
    return;
  }

  console.log(`Downloading ${url}`);

  const resp = await fetch(url);
  const data = await resp.arrayBuffer();
  await writeFile(filepath, Buffer.from(data));
}
