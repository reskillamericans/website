+++
title = "README\nReskill Americans Website"
date = 2022-01-12
draft = false
layout = "document"
+++

This README describes the
[repository](https://github.com/reskillamericans/website) for the 2022 Reskill
Americans website.

View the current [staging version here](https://reskill-learning.web.app/).

This will combine the "marketing" website with a log-in site for participants.

## Current Features

- Complete "Marketing" web site:
  - / (home)
  - /learn-more
  - /partner
  - /donate
  - /about-us
  - /news
  - /faq
- Integrations
  - Sign-in via LinkedIn (3rd parth OAuth).
  - YouTube - all our channel videos are synchronized to appear
    on our /news (aka "blog") portion of the site.
- Form submission
  - /enrollment
  - /volunteer (still TBD)

## Future Goals

- User profile (add LinkedIn profile pic)
- Integrations:
  - Mailchimp - for {{< cohort >}} mass-mailing
  - Sendgrid - for transaction emails
  - Canvas LMS (or Zuir LMS)
  - GitHub
  - Zoom(?)
- Mentor/participant matching - grouping participants into small learning "pods"
  to build peer support and community.
- Collecting ongoing metrics via surveys, content engagement, and course
  completions so we have longitudinal data on all participants, progress, and
  success rates.

# Technology Choices

This is a statically generated web site using [Hugo](https://gohugo.io/).

The backend uses [Firebase](https://firebase.google.com/) including [Google
Cloud Firestore](https://firebase.google.com/docs/firestore) for collecting and
reporting data, user-authentication, and Firebase functions for code that needs
to run in a secure context (such as OAuth validation).

All code is in TypeScript, and uses Mocha/Chai for testing and continuous
integration.

# Using this repository

The tooling for this project has been tested using Linux.  It works on
a Mac (but must use the bash shell and manually install Hugo, using brew, for
example) - but would need some tweaking to use Windows (perhaps using WSL or
GitBash).

To get started:

```
$ source tools/use
$ configure
$ build
$ run-tests
$ test-server
```

When making content and css changes, it is convenient to automatically process website updates:

```
$ hugo-watch
```

Only PR's that have passed testing can be merged to the main branch (and only FF commits are allowed in main).

Further documentation for content editors and maintainers:

- [Cookbook](/docs/cookbook) - How to perform common tasks.
- [Architecture](/docs/architecture) - Describes technology choices and
  customizations.
