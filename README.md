# Reskill Americans Learning

This is repository for the 2022 Reskill Americans website.

View the current [staging version here](https://reskill-learning.web.app/).

This will combine the "marketing" website with a log-in site for participants.

The primary features here are:

- Collecting user information, including linking to LinkedIn identity
  for all participants.
- Collecting ongoing metrics via surveys, content engagement, and course
  completions so we have longitudinal data on all participants, progess, and
  success rates.
- Comprehensive skills database by which to measure job readiness.
- Learning pathways designed to teach the required skills.
- Mentor/participant matching - grouping participants into small learning
  "pods" to build peer support and community.
- Collect progress information on skills acquisition and project completions.
- Logins for participants, paid and volunteer mentors, and administrators.
- Reporting on participant activities and survey results.

# Technology Choices

In as much as possible, this will be a staticly generated web site using
[Hugo](https://gohugo.io/). As such, the primary templating language will be
[Go Templates](https://pkg.go.dev/text/template).

Some data will be rendered dynamically from source-controlled JSON datasets
(e.g., the Skills database).  We will use React for client-side rendering.

The backend will use [Firebase](https://firebase.google.com/) incuding
[Google Cloud Firestore](https://firebase.google.com/docs/firestore) for
collecting and reporting data, user-authentication, Firebase functions for code
that needs to run in a secure context (such as OAuth validation).

All code is in TypeScript, and uses Mocha/Chai for testing and continuous
integration.

# Using this repository

The tooling for this project has been tested using Linux.  It probably also
works on a Mac - but would need some tweaking to use Windows (perhaps using WSL
or GitBash).

To get started:

```
$ source tools/use
$ configure
$ build
$ run-tests
$ test-server
```

When making content and css changes, it is convenient to automatically process
website updates:

```
$ hugo-watch
```

Only PR's that have passed testing can be merged to the main
branch (and only FF commits are allowed in main).

## Directory Structure

| Directory | Usage |
--- | --- |
| .github | GitHub actions workflow definitions. |
| node_modules | Node/npm installed packages. |
| src | TypeScript source files. |
| static | Files to be copied to server "as is" |
| static/scripts | Bundled client-side JavaScript files - compiled from TypeScript |
| data | Hugo data files |
| content | Hugo content files |
| archetypes | Hugo file types |
| themes | Hugo theme files |
| resources | Hugo caches? |
| public | Hugo builds website here.  This directory is copied to Firebase Hosting. |
| tools | Utility commands for this repo. |
| bin | External tools installed here (e.g. Hugo) |
