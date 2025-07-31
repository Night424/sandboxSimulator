const { app, BrowserWindow } = require('electron');
const path = require('path');
const { ipcMain } = require('electron');
const { exec } = require('child_process');
const fs = require('fs');

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

  exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`⚠️ Stderr: ${stderr}`);
      return;
    }
    console.log(`📄 Output:\n${stdout}`);
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