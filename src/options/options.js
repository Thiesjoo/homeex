function saveOptions() {
  const version = document.getElementById('version').value;
  chrome.storage.sync.set({
    version
  }, function () {
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function () {
      status.textContent = '';
    }, 750);
  });
}

function restoreOptions() {
  chrome.storage.sync.get({
    version: "production"
  }, function (items) {
    document.getElementById('version').value = items.version;
  });
}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click',
  saveOptions);