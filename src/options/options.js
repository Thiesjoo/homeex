function saveOptions() {
  const version = document.getElementById('version').value;
  const pos = document.getElementById('enablePos').checked;

  chrome.storage.sync.set({
    version,
    pos
  }, function () {
    const enabled = document.getElementById("enabled")
    enabled.className = "" + pos;
    enabled.textContent = pos ? "YES" : "NO"

    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function () {
      status.textContent = '';
    }, 750);
  });
}

async function restoreOptions() {
  chrome.storage.sync.get({
    version: "production",
    pos: false
  }, function ({ version, pos }) {
    const enabled = document.getElementById("enabled")
    enabled.className = "" + pos;
    enabled.textContent = pos ? "YES" : "NO";

    const enablePos = document.getElementById("enablePos")
    enablePos.checked = pos

    document.getElementById('version').value = version;
  });


  // First refresh all of our tokens
  await fetch("https://auth.thies.dev/auth/refresh/access", {
    credentials: "include",
    method: "GET",
  })

  let userData = await fetch('https://auth.thies.dev/api/users/me', { credentials: 'include' })

  const user = document.getElementById("username")
  user.textContent = (await userData.json())?.name

  const providerData = await fetch('https://auth.thies.dev/api/providers/me', { credentials: 'include' })
  const providersAvailable = (await providerData.json())
  const foundPos = !!providersAvailable.find(x => x.name === "via" && x.id === "pos")

  const syncing = document.getElementById("syncing");
  syncing.className = "" + foundPos;
  syncing.textContent = foundPos ? "YES" : "No, please contact admin to enable it for you";
  if (foundPos) {
    const enablePos = document.getElementById("enablePos")
    enablePos.disabled = false
  } else {
    chrome.storage.sync.set({ pos: false })
  }
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click',
  saveOptions);
