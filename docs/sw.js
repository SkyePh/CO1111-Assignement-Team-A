//service worker
const API_ORIGIN = "https://codecyprus.org";

self.addEventListener("fetch", function (event) {
  const url = event.request.url;
  

  if (url.startsWith(API_ORIGIN)) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(fetch(event.request));
});
