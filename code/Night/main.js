const { app, shell, BrowserWindow } = require('electron');
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

function getLogsDirectory() {
  const logsDir = path.join(__dirname, 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  }
  return logsDir;
}
// Listen for script run request
ipcMain.on('run-python-script', (event, scriptName) => {
  const scriptPath = path.join(__dirname, 'fake-malware', scriptName);
  const pyProcess = spawn('python', [scriptPath]);
  
  // Create log file
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const logFile = path.join(getLogsDirectory(), `${scriptName}-${timestamp}.log`);
  const logStream = fs.createWriteStream(logFile, { flags: 'a' });

  pyProcess.stdout.on('data', data => {
    const output = data.toString();
    logStream.write(output);
    event.sender.send('log-line', output);
  });

  pyProcess.stderr.on('data', data => {
    const output = '[stderr] ' + data.toString();
    logStream.write(output);
    event.sender.send('log-line', output);
  });

  pyProcess.on('close', code => {
    const output = `Process exited with code ${code}`;
    logStream.write(output + '\n');
    logStream.end();
    event.sender.send('log-line', output);
    event.sender.send('log-saved', logFile);
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

ipcMain.handle('view-logs', async () => {
  const logsDir = getLogsDirectory();
  const files = fs.readdirSync(logsDir);
  return files.map(file => ({
    name: file,
    path: path.join(logsDir, file)
  }));
});

ipcMain.handle('open-logs-folder', async () => {
  const logsDir = getLogsDirectory();
  shell.openPath(logsDir);
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