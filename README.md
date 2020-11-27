## About

This is the source code for Approach Zero [search page](https://approach0.xyz/search) front-end written in Vue3.

There is an old one written in 2017 which serves a lot of traffic but not mobile friendly.
This one enables users to input math more easily on mobile device, and it should look more beautiful?

Good retirement! :house: :older_man:

### Development Setup
```sh
$ npm install
$ npm run watch
```
View the webpage at `http://localhost:19985`.

### Deployment Setup
Set environment variable `A0_RELAY_URL` (so that the AJAX request will target to `$A0_RELAY_URL/?p=1&q=your_query`) and issue
```sh
$ npm serve
```
