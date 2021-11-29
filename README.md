# Reskill Americans Learning

This is repository for the 2022 Reskill Americans learning website.

Note: We may possibly combine the "marketing" website with this one - but
the core focus here is on building the learning platform for our next
cohort.

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

To get started:

```
$ source tools/use
$ configure
$ npm build
$ npm test
$ npm serve
```

Only PR's that have passed testing can be merged to the main
branch (and only FF commits are allowed in main).

