const { app, BrowserWindow } = require('electron');
const path = require('path');
const { ipcMain } = require('electron');
const fs = require('fs');
const { spawn } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
}

// Listen for script run request
ipcMain.on('run-python-script', (event, scriptName) => {
  const scriptPath = path.join(__dirname, 'fake-malware', scriptName);
  const pyProcess = spawn('python', [scriptPath]);

  pyProcess.stdout.on('data', data => {
    event.sender.send('log-line', data.toString());
  });

  pyProcess.stderr.on('data', data => {
    event.sender.send('log-line', '[stderr] ' + data.toString());
  });

  pyProcess.on('close', code => {
    event.sender.send('log-line', `Process exited with code ${code}`);
  });
});

ipcMain.handle('get-script-list', async () => {
  const scriptDir = path.join(__dirname, 'fake-malware');
  try {
    const files = fs.readdirSync(scriptDir);
    // Filter to only .py or .js files
    return files.filter(file => file.endsWith('.py') || file.endsWith('.js'));
  } catch (err) {
    console.error('Error reading script folder:', err);
    return [];
  }
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});