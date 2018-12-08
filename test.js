var bigass = 99999

var maxvalue = bigass.toString();
var maxpart1 = maxvalue.slice(0, 2);
var maxpart2 = '0'.repeat(Math.max(0, maxvalue.length - 2));
var maxscale = maxpart1 + maxpart2;
console.log(maxscale);