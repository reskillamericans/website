#!/usr/bin/env node
// remove-dup-paths --- Process :-separated path-like string for dups.

function help(errString) {
    if (errString) {
        console.error(errString);
    }
    console.error('Usage: PATH="$(remove-dup-paths $PATH)"');
    process.exit(1);
}

if (process.argv.length !== 3) {
    help("Require single path-formatting string (e.g., $PATH)");
}

const pathString = process.argv[2];
const paths = pathString.split(':');

const deduped = [];

for (let path of paths) {
    if (!deduped.includes(path)) {
        deduped.push(path);
    }
}

console.log(deduped.join(':'));
