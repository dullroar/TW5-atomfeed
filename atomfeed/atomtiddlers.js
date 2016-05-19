/*\
title: $:/plugins/dullroar/atomfeed/atomtiddlers.js
type: application/javascript
module-type: macro

Macro to output tiddlers matching a filter to JSON

\*/
(function() {
  var AtomSmasher = require("$:/plugins/dullroar/atomfeed/atomsmasher");

  /*jshint node: true, browser: true */
  /*global $tw: false */
  "use strict";

  exports.name = "atomtiddlers";

  exports.params = [
    {
      name: "filter",
      default: "[!is[system]!has[draft.of]!sort[modified]]"
    }
  ];

  exports.run = function(filter) {
    return new AtomSmasher({wiki: this.wiki, document: this.document})
      .feedify(this.wiki.filterTiddlers(filter));
  };
})();
