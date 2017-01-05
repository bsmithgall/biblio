# Biblio

Organize the home library, and track what you are reading. Basically, a mashup of [Goodreads](https://www.goodreads.com/) and [Trello](https://trello.com/).

## Tech

It's mostly a learning attempt, so it's made up of things I don't know very well -- the backend is [Golang](https://golang.org/), and the front-end is [React](https://facebook.github.io/react/) with styles made from [Bourbon](http://bourbon.io/) components. It is meant to run on [Google App Engine](https://cloud.google.com/appengine/).

## Todo

The first version's featureset is going to be extremely limited: you will be able to add books to a list and move them around:

+ [x] Wire up a (mostly) functional drag-and-drop/not-as-good-as-trello style interface
+ [x] Add support for adding new "works"
+ [ ] Figure out an API contract between the front-end and the backend
+ [ ] Talk to either the [Google Books API](https://developers.google.com/books/) or a different one to get book metadata
+ [ ] Wire it all up
+ [ ] Deploy it out

More to come as this gets developed out.
