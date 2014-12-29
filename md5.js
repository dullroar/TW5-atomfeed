/*
MD5 hash function by James Taylor [@jbt], adapted as a TiddlyWiki5 macro by Jim Lehmer [@dullroar]
https://github.com/jbt/js-crypto.

Licensed under The ☺ License
http://licence.visualidiot.com/

By attaching this document to the given files (the “work”), you, the licensee, are hereby granted free usage in both personal and commerical environments, without any obligation of attribution or payment (monetary or otherwise). The licensee is free to use, copy, modify, publish, distribute, sublicence, and/or merchandise the work, subject to the licensee inflecting a positive message unto someone. This includes (but is not limited to): smiling, being nice, saying “thank you”, assisting other persons, or any similar actions percolating the given concept.

The above copyright notice serves as a permissions notice also, and may optionally be included in copies or portions of the work.

The work is provided “as is”, without warranty or support, express or implied. The author(s) are not liable for any damages, misuse, or other claim, whether from or as a consequence of usage of the given work.
*/

(function(){

"use strict"

exports.name = "dullroar-md5";

exports.params = [
    { name: "str" },
    { name: "format" }
];

var k = [], i = 0;

for(; i < 64; ){
    k[i] = 0|(Math.abs(Math.sin(++i)) * 4294967296);
}

exports.run = function(str, format){
    var b, c, d, j,
        x = [],
        str2 = unescape(encodeURI(str)),
        a = str2.length,
        h = [b = 1732584193, c = -271733879, ~b, ~c],
        i = 0;

    for(; i <= a; ) x[i >> 2] |= (str2.charCodeAt(i)||128) << 8 * (i++ % 4);

    x[str = (a + 8 >> 6) * 16 + 14] = a * 8;
    i = 0;

    for(; i < str; i += 16){
      a = h; j = 0;
      for(; j < 64; ){
        a = [
          d = a[3],
          ((b = a[1]|0) +
            ((d = (
              (a[0] +
                [
                  b & (c = a[2]) | ~b&d,
                  d & b | ~d & c,
                  b ^ c ^ d,
                  c ^ (b | ~d)
                ][a = j >> 4]
              ) +
              (k[j] +
                (x[[
                  j,
                  5 * j + 1,
                  3 * j + 5,
                  7 * j
                ][a] % 16 + i]|0)
              )
            )) << (a = [
              7, 12, 17, 22,
              5,  9, 14, 20,
              4, 11, 16, 23,
              6, 10, 15, 21
            ][4 * a + j++ % 4]) | d >>> 32 - a)
          ),
          b,
          c
        ];
      }
      for(j = 4; j; ) h[--j] = h[j] + a[j];
    }

    str = '';
    for(; j < 32; ) str += ((h[j >> 3] >> ((1 ^ j++ & 7) * 4)) & 15).toString(16);
    
    format = format || "hex";

    if(format.toLowerCase() === "guid") {
        // This is a special use case where we use the 128 bits conveniently returned by a MD5
        // hash and format it as a pseudo-GUID for use in things like an ATOM feed id field.
        // The idea being the MD5 hash should have few collisions on tiddler titles, and yet
        // will always return the same hash for the same title string, which then gives us the
        // persistent id semantics that the ATOM spec requires. Other crypto hashes like SHA
        // return too many bits for this.
        
    } else {
        return str;
    }
};
})();