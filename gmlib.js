/**
 * Helper library to make greasemonkey development easier and faster
 *
 * Use by adding the following two lines to the user script manifest (top comment):
 *
 * // @require  https://cdn.rawgit.com/jojje/userscripts/master/gmlib.js
 * // @grant    GM_xmlhttpRequest
 *
 */

var gm = (function(){
  var LOGGING = false;

  function debug() {
    if(LOGGING && typeof(console) !== 'undefined' && console.debug) console.debug.apply(console, arguments);
  }
  function error() {
    if(LOGGING && typeof(console) !== 'undefined' && console.error) console.error.apply(console, arguments);
  }

  function get(url, headers) {
    return new Promise(function(resolve, reject) {
      GM_xmlhttpRequest({
        method: 'GET',
        headers: headers,
        url: url,
        onload: function(response) {
          debug('GET '+ url);
          if(response.status >= 200 && response.status < 300) {
            resolve(response.responseText);
          } else {
            var msg = [response.status, '(url: '+ url +')'].join(' ');
            error(msg);
            reject(msg);
          }
        }
      });
    });
  }

  function getDoc(url, headers) {
    return get(url, headers).then(function(html) {
      var parser = new DOMParser();
      return parser.parseFromString(html, 'text/html');
    });
  }

  function addCss(css) {
    var el = document.createElement('style');
    el.setAttribute('type', 'text/css');
    el.innerText = css;
    document.body.appendChild(el);
  }

  return {
    // Ajax GET raw HTML of *any* page on the web, disregarding CORS browser constraint.
    // Returns a Javascript promise that resolves the fetched HTML text.
    get: get,

    // Ajax GET *any* page on the web as a DOM object, for easy xpath/css processing.
    // Returns a Javascript promise that resolves a DOM object of the fetched page.
    getDoc: getDoc,

    // Inlines a CSS style block into the page
    addCss: addCss,
    
    enableLogging: function(){ LOGGING = true; }
  };
}());
