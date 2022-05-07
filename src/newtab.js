const URLMAP = {
  "production": "https://thies.dev/home",
  "preview": "https://preview.thies.dev/home",
  "local": "http://localhost:3000/home",
}

chrome.storage.sync.get({
  version: "production"
}, function (items) {
  const iframe = document.getElementById("iframe")
  iframe.src = URLMAP[items.version];
});