# TW5-atomfeed

TiddlyWiki5 plugin to generate ATOM feed (http://www.ietf.org/rfc/rfc4287.txt).

It works in the browser (sort of) but its primary use case is for generating a feed for static sites
using something similar to the following when running TiddlyWiki under node.js:

```
tiddlywiki --rendertiddlers [!is[system]] statictiddler.html static text/plain  --rendertiddler atomfeed atom.xml text/plain
```

If you want to hack it to work better for a single-file browser-based TW, see Felix
Richter's [@makefu] approach in the comment thread [here](https://github.com/Jermolene/TiddlyWiki5/issues/677#issuecomment-74571712).

The rest of this document presumes familiarity with TiddlyWiki5 (TW) and node.js (node).

## Setup

The following presumes you are running TW under node:

1. In the directory for your TW, if there is not already a directory named *plugins*, create one.
It should be a sibling of the *tiddlers* directory.
2. Clone or download the files in this project into a subdirectory of *plugins* called *dullroar*.
3. Change the URL in *dullroar/atomfeed/atomserver.tid* from `http://dullroar.com/` to your own site's URL. Note that
the ending `/` is required.
4. Make sure the `$:/SiteTitle` tiddler is set (in `$:/ControlPanel`, it is the field with the "Title
of this TiddlyWiki" label).
5. Optionally set the `$:/SiteSubtitle` tiddler (in `$:/ControlPanel`, it is the field with the "Subtitle"
label).
6. Make sure the `$:/status/UserName` tiddler is set (if running under node this is typically passed in
as a parameter to the `--server` command).
7. Change the *dullroar/tiddlywiki.info* file so that the `plugins` array has `dullroar/atomfeed` in it, e.g.,
`"plugins": ["dullroar/atomfeed"],`.
8. Make sure the tiddlers you want in the feed are tagged (see below).
9. Optionally make sure the tiddlers you want in the feed have a `summary` field (see below).

## Working With Tiddlers

`atomfeed` uses the following TW filter to select tiddlers for the feed:

```
[!is[system]!untagged[]!tag[static]!title[Table of Contents]!sort[modifed]]
```

This basically says:

1. Do not include "system" tiddlers.
2. Do not include tiddlers without a tag.
3. Do not include tiddlers with a tag of "static" (I use tiddlers tagged "static" to hold assets for
my static web site).
4. Do not include a tiddler entitled "Table of Contents".
5. Sort by modified date in descending order (currently there is a bug where this doesn't seem to be
happening).

So, the net of all that is that any tiddlers you create that are tagged (and with something other than
"static") will be placed in the feed.

In addition, if you create a field on your tiddlers called `summary`, then that will be used for the
summary text for the ATOM entry for that tiddler. Otherwise it will use the first 20 "words" in the
tiddler text (crude).

**Note:** At this time including the entire tiddler text in the feed entry is not supported.

## Generating a Feed

To generate the feed for a static site, I use a command similar to (all on one line):

```
tiddlywiki --rendertiddlers [!is[system]!tag[static]] statictiddler.html static text/plain --rendertiddler $:/core/templates/static.template.css static/static.css text/plain --rendertiddler atomfeed atom.xml text/plain 
```

If you want to use this in-browser, you can build a TW using the following command under node:

```
tiddlywiki --build index
```

The resulting *index.html* file in the *output* directory will have the plugin installed. You can navigate to
the *atomfeed* tiddler under Shadows, or once you've opened the file with `index.html#atomfeed`.

Or you can simply run the TW under node:

```
tiddlywiki --verbose --server 8080 $:/core/save/lazy-images text/plain text/html Jim
```

And then navigate directly to the feed tiddler using http://localhost:8080/#atomfeed.

## Acknowledgments

Built for TiddlyWiki5 by Jeremy Ruston [@Jermolene], https://github.com/Jermolene/TiddlyWiki5, possibly
the coolest thing you can do with a browser.

This plugin uses the MD5 hash function by James Taylor [@jbt], https://github.com/jbt/js-crypto.
