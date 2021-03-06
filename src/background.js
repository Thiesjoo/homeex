function requestData(url, token) {
  fetch(url, {
    credentials: "include",
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ accessToken: token })
  })
    .then(x => x.json()).then(x => console.log("URL:", url, "resp: ", x))
}


chrome.webNavigation.onBeforeNavigate.addListener(function () {
  chrome.webRequest.onSendHeaders.addListener(
    function (details) {
      chrome.storage.sync.get({
        pos: false
      }, async function ({ pos }) {
        if (!pos) {
          console.log("NOT SYNCING BECAUSE OF CHECKBOX")
        } else {
          const correctHeader = details.requestHeaders.find(x => x.name.toLowerCase() === "authorization")

          if (correctHeader) {
            const token = correctHeader.value.split(" ")?.[1];
            if (!token) return;

            try {
              // Real server has to refresh
              await fetch("https://auth.thies.dev/auth/refresh/access", {
                credentials: "include",
                method: "GET",
              })
              requestData("https://auth.thies.dev/api/providers/me/via/pos", token)
            } catch (e) {
              console.error("Request to thies.dev failed with error:", e)
            }
          } else {
            console.error("How can you have no auth header, but send request to POS")
          }
        }
      });
    },
    { urls: ["https://pos.svia.nl/api/account/"] },
    ["requestHeaders"]
  );
}, {
  url: [{ hostContains: "svia" }]
});
