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

document.getElementById('viewLogs').addEventListener('click', async () => {
  const logs = await ipcRenderer.invoke('view-logs');
  if (logs.length === 0) {
    appendLog('No logs found.');
    return;
  }
  
  logOutput.textContent = 'Available logs:\n\n';
  logs.forEach(log => {
    appendLog(`${log.name}`);
  });
});

document.getElementById('openFolder').addEventListener('click', async () => {
  await ipcRenderer.invoke('open-logs-folder');
});

ipcRenderer.on('log-saved', (event, logPath) => {
  appendLog(`\nLog file saved: ${logPath}`);
});
