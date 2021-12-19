#!/usr/bin/env node
// get-video-data.mjs --- Use youtube search api to get info on all our videos.

import { mkdir, readFile, writeFile } from 'fs/promises';
import slugify from 'slugify';
import fetch from 'node-fetch';

const API_URL = 'https://www.googleapis.com/youtube/v3/';

const outFile = 'data/youtube-videos.json';

const {youtube} = JSON.parse(
  await readFile('tools/api-keys.json', 'utf8')
);
const { channelId, apiKey } = youtube;

const playlists = await getChannelPlaylistInfo(channelId, apiKey);
const videos = await getChannelVideoInfo(channelId, apiKey);
await getAdditionalVideoInfo(videos, apiKey);

await writeFile(outFile, JSON.stringify({videos, playlists}, null, 2));
console.log(`Found video info for ${videos.length} videos and ${playlists.length} playlists.`);
console.log(`Written to ${outFile}.`);

// Returns id, title, and itemCount and videos for each channel-defined playlist.
async function getChannelPlaylistInfo(channelId, key) {
  const params = new URLSearchParams({
    key, channelId,
    part: 'snippet,contentDetails',
    maxResults: 50,
  });

  const resp = await fetch(`${API_URL}playlists?${params}`);
  const json = await resp.json();

  const results = json.items.map(playlist => {
    return {
      id: playlist.id,
      title: playlist.snippet.title,
      itemCount: playlist.contentDetails.itemCount
    };
  });

  // Populate the video ids for each playlist.
  for (const playlist of results) {
    const videos = await getPlaylistVideoInfo(playlist.id, "contentDetails", key);
    playlist.videos = videos.map(video => video.contentDetails.videoId);
  }

  return results;
}

async function getChannelVideoInfo(channelId, key) {
  const uploadPlaylist = await getUploadPlaylist(channelId, key);
  return await getPlaylistVideoInfo(uploadPlaylist, 'snippet,contentDetails', key);
}

async function getPlaylistVideoInfo(playlistId, part, key) {
  const params = new URLSearchParams({
    key, part, playlistId,
    maxResults: 50
  });

  const results = [];

  while (true) {
    const resp = await fetch(`${API_URL}playlistItems?${params}`);
    const json = await resp.json();
    results.push(...json.items);
    if (!json.nextPageToken) {
      // Sort in chonological order.
      results.sort((a, b) => {
        const aDate = new Date(a.contentDetails.videoPublishedAt);
        const bDate = new Date(b.contentDetails.videoPublishedAt);
        return aDate - bDate;
      });
      return results;
    }
    params.set('pageToken', json.nextPageToken);
  }
}

// The "upload stream" is defined as a playlist.
async function getUploadPlaylist(channelId, key) {
  const channelParams = new URLSearchParams({
    key,
    id: channelId,
    part: 'contentDetails'
  });

  const resp = await fetch(`${API_URL}channels?${channelParams}`);
  const json = await resp.json();
  return json.items[0].contentDetails.relatedPlaylists.uploads;
}

async function getAdditionalVideoInfo(videos, key) {
  const videoMap = new Map();

  for (const video of videos) {
    const videoId = video.contentDetails.videoId;
    videoMap.set(videoId, video);
  }

  for (const ids of chunkKeys(videoMap, 50)) {
    const params = new URLSearchParams({
      key,
      part: 'statistics,liveStreamingDetails',
      id: ids.join(',')
    });

    const resp = await fetch(`${API_URL}videos?${params}`);
    const json = await resp.json();

    for (const video of json.items) {
      const videoInfo = videoMap.get(video.id);
      videoInfo.statistics = video.statistics;
      videoInfo.liveStreamingDetails = video.liveStreamingDetails;
    }
  }
}

// Takes an interater of key/value pairs.
function *chunkKeys(iter, size) {
  let chunk = [];
  for (const item of iter) {
    chunk.push(item[0]);
    if (chunk.length === size) {
      yield chunk;
      chunk = [];
    }
  }
  if (chunk.length) {
    yield chunk;
  }
}
