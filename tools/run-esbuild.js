#!/usr/bin/env node

// ESBuild transpiles TypeScript directly.  We keep the
// tsc build around (and the generated scripts files) for type
// checking.

require('esbuild').buildSync({
    entryPoints: ['src/index.ts'],
    bundle: true,
    // minify: true,
    sourcemap: true,
    outfile: 'public/scripts/reskill.js',
  })
