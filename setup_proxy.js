var env = process.env;

//console.log('PROXY: '+proxy)

if (!env['http_proxy']) return;

var localUrls = [
  'http://localhost',
  'https://localhost',
  'localhost',
  'http://127.0.0.1',
  'https://127.0.0.1',
  '127.0.0.1'
];

var url    = require('url');
var tunnel = require('tunnel');
var proxy = url.parse(env['http_proxy']);


var tunnelingAgent = tunnel.httpsOverHttp({
  proxy: {
    host: 'p-goodway.rd.francetelecom.fr',
    port: 3128
  }
});

console.log(tunnelingAgent)



var https = require('https');
var http = require('http');

var oldhttpsreq = https.request;
https.request = function (options, callback) {

  if (localUrls.some(function (u) {
    return ~u.indexOf(options.host);
  })){
    return oldhttpsreq.apply(https, arguments);
  }

  options.agent = tunnelingAgent;
  return oldhttpsreq.call(null, options, callback);
};
/*
var oldhttpreq = http.request;
http.request = function (options, callback) {

  if (localUrls.some(function (u) {
    return ~u.indexOf(options.host);
  })){
    return oldhttpreq.apply(http, arguments);
  }

  options.agent = tunnelingAgent;
  return oldhttpreq.call(null, options, callback);
};*/