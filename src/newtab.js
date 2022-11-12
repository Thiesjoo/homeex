const URLMAP = {
  "production": "https://thies.dev/",
  "preview": "https://preview.thies.dev/",
  "local": "http://localhost:3000/",
}

chrome.storage.sync.get({
  version: "production",
  devicesEnabled: false
}, function (items) {
  const home = document.getElementById("iframe");
  const devices = document.getElementById("dashboard");

  home.src = URLMAP[items.version] + "home";

  if (items.devicesEnabled) {
    devices.src = URLMAP[items.version] + "devices";
  } else {
    devices.style.display = "none";

    const parent = document.getElementsByClassName("parent")[0]
    parent.style.overflow = "hidden";
  }
});