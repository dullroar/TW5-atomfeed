/*\
created: 20141221145616722
creator: Jim
modified: 20160426001200000
modifier: Sukima
module-type: macro
tags: static
title: $:/plugins/dullroar/atomfeed/atomentries.js
type: application/javascript

Macro to output tiddlers matching a filter to ATOM entries.
http://www.ietf.org/rfc/rfc4287.txt

\*/
var md5 = require("$:/plugins/dullroar/atomfeed/md5");

(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";
 
exports.name = "atomentries";

exports.params = [
	{
		name: "filter",
		default: "[!is[system]!untagged[]!tag[static]!title[Table of Contents]!sort[modifed]]"
	}
];

var XML = {};

XML.encodeLinkComponent = function(link) {
	return link.replace(/ /g, "%2520");
}

XML.escapify = function(input) {
	return input.replace(/</gm, "&lt;").replace(/>/gm, "&gt;").replace(/&/gm, "&amp;").replace(/"/gm, "&quot;").replace(/'/gm, "&apos;");
};

XML.twDateToISO8601 = function(twDate) {
	return $tw.utils.formatDateString(twDate, "YYYY-0MM-0DDT0hh:0mm:0ss");
}

XML.stringify = function(data) {
	var server = $tw.wiki.getTiddlerText("$:/config/atomserver", "");
	var linkType = $tw.wiki.getTiddlerText("$:/config/atomlinktype", "static");
	var x = "";

	if (server.slice(-1) !== "/") {
		server += "/";
	}

    data.forEach(function(element, index, array) {
    	x += "\t\t<entry>\n\t\t\t<title>" + element.title + "</title>\n";
        var md5hash = md5.hash(element.title);
        // This is a special use case where we use the 128 bits conveniently returned by a MD5
        // hash and format it as a pseudo-GUID for use in things like an ATOM feed id field.
        // The idea being MD5 should have no collisions on tiddler titles, and yet will always
        // return the same hash for the same title string, which then gives us the persistent
        // id semantics that the ATOM spec requires. Other crypto hashes like SHA return too
        // many bits for this.
        x += "\t\t\t<id>urn:uuid:" + md5hash.substring(0,8) + "-" + md5hash.substring(8,12) + "-" + md5hash.substring(12,16) + "-" + md5hash.substring(16,20) + "-" + md5hash.substring(20) + "</id>\n";

		var link;
		switch (linkType) {
			case "permalink":
				link = "#" + XML.encodeLinkComponent(element.title);
				break;
			default:
				link = "static/" + XML.encodeLinkComponent(element.title) + ".html";
		}
		x += "\t\t\t<link href='" + server + link + "'/>\n";

		if (element.modified) {
			x += "\t\t\t<updated>" + XML.twDateToISO8601($tw.utils.parseDate(element.modified)) + "</updated>\n";
		}
        x += "\t\t\t<summary>";
        if(!!element.summary) {
        	x += element.summary;
        } else {
        	var words = element.text.split(/\s/g,20);
        	x += words.join(" ");
        }
        x += "</summary>\n"
	    x += "\t\t</entry>\n";
    });
    return x;
}

exports.run = function(filter) {
	var tiddlers = this.wiki.filterTiddlers(filter),
		data = [];
	for(var t=0; t < tiddlers.length; t++) {
		var tiddler = this.wiki.getTiddler(tiddlers[t]);
		if(tiddler) {
			var fields = new Object();
			for(var field in tiddler.fields) {
				fields[field] = XML.escapify(tiddler.getFieldString(field));
			}
			data.push(fields);
		}
	}
	return XML.stringify(data);
};

})();
