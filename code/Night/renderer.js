const { ipcRenderer } = require('electron');

const logOutput = document.getElementById('logOutput');

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

function appendLog(message) {
  logOutput.textContent += message + '\n';
  logOutput.scrollTop = logOutput.scrollHeight;
}

ipcRenderer.on('log-line', (event, data) => {
  appendLog(data);
});

document.getElementById('runScriptBtn').addEventListener('click', () => {
  logOutput.textContent = ''; // Clear previous logs
  const selectedScript = document.getElementById('scriptSelect').value;
  ipcRenderer.send('run-python-script', selectedScript);
});

document.getElementById('viewLogs').addEventListener('click', () => {
  alert('View Logs coming soon!');
});

document.getElementById('openFolder').addEventListener('click', () => {
  alert('Open Folder coming soon!');
});
