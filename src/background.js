/**
 * Try to get an accesstoken for thies.dev
 * @returns 
 */
async function getAccessToken() {
  const accessToken =
    await chrome.cookies.get({ name: "accesstoken", url: "https://thies.dev" })
  if (accessToken) {
    return accessToken.value
  }
  const refreshToken =
    await chrome.cookies.get({ name: "refreshtoken", url: "https://auth.thies.dev/auth" })

  if (!refreshToken) {
    throw new Error("No tokens found")
  }
  await fetch("https://auth.thies.dev/auth/refresh/access", {
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${refreshToken.value}`
    },
    method: "GET",
  })

  const accessToken2 =
    await chrome.cookies.get({ name: "accesstoken", url: "https://thies.dev" })
  if (accessToken2) {
    return accessToken2.value
  }

  throw new Error("Refresh failed")
}

async function requestData(url, token) {
  fetch(url, {
    credentials: "include",
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${await getAccessToken()}`
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
              await requestData("https://auth.thies.dev/api/providers/me/via/pos", token)
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
