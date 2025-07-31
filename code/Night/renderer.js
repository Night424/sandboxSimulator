const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', async () => {
  const select = document.getElementById('scriptSelect');
  const scripts = await ipcRenderer.invoke('get-script-list');

  scripts.forEach(script => {
    const option = document.createElement('option');
    option.value = script;
    option.textContent = script;
    select.appendChild(option);
  });
});

document.getElementById('runScriptBtn').addEventListener('click', () => {
  const selectedScript = document.getElementById('scriptSelect').value;
  ipcRenderer.send('run-python-script', selectedScript);
});

document.getElementById('viewLogs').addEventListener('click', () => {
  alert('View Logs coming soon!');
});

document.getElementById('openFolder').addEventListener('click', () => {
  alert('Open Folder coming soon!');
});
