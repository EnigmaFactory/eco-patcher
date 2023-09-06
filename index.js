const { app, BrowserWindow } = require('electron');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const AdmZip = require('adm-zip');
const { ipcMain } = require('electron');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        icon: path.join(__dirname, 'assets/favicon.png') // or 'assets/icon.ico' for Windows
    });

    mainWindow.loadFile('index.html');

    // Hide Menu Bar - Alt to Show
    mainWindow.autoHideMenuBar = true;
    // mainWindow.setMenu(null);

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});

function checkForUpdates() {
    axios.get('https://evercraftonline.com/versions')
        .then(response => {
            let serverVersion = response.data.version;
            let localVersion = getLocalVersion();

            if (serverVersion !== localVersion) {
                downloadAndExtractGame();
            } else {
                launchGame();
            }
        })
        .catch(error => {
            console.error("Error checking for updates:", error);
            downloadAndExtractGame(); // Fallback to downloading the game if API call fails
        });
}

function getLocalVersion() {
    // Retrieve local version from a file or local setting
    // This is a mock; replace with your method of tracking local version
    return "0.7.17";  
}

function downloadAndExtractGame() {
    const zipPath = path.join(__dirname, 'EverCraftOnline.zip'); 
    const outputDir = path.join(__dirname);

    axios.get('https://www.evercraftonline.com/client', { responseType: 'stream' })
        .then(response => {
            const totalLength = parseInt(response.headers['content-length'], 10);
            let downloaded = 0;
            
            // As we receive data chunks, update the downloaded amount and send progress
            response.data.on('data', (chunk) => {
                downloaded += chunk.length;
                const progress = parseFloat((downloaded / totalLength * 100).toFixed(2));
                
                // Send progress to renderer
                if (mainWindow && !mainWindow.isDestroyed()) {
                    mainWindow.webContents.send('download-progress', progress);
                }
            });

            const writer = fs.createWriteStream(zipPath);
            response.data.pipe(writer);

            writer.on('finish', () => {
                // Extract the zip and then launch the game
                const zip = new AdmZip(zipPath);
                zip.extractAllTo(outputDir, /*overwrite=*/true);
                
                launchGame();
            });

            writer.on('error', err => {
                console.error("Error writing zip file:", err);
                // Send an error to the renderer if you wish
                mainWindow.webContents.send('download-error', 'An error occurred while downloading.');
            });
        })
        .catch(error => {
            console.error("Error downloading game:", error);
            // Send an error to the renderer if you wish
            mainWindow.webContents.send('download-error', 'Could not download the game.');
        });
}

function launchGame() {
    // Adjust this path if necessary based on your extracted structure
    const gamePath = path.join('Client', 'EverCraftOnline.exe');
    exec(gamePath, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);

        app.quit();  // Close the Electron app
    });
}

// Listen for the 'repair-requested' event from the renderer process
ipcMain.on('repair-requested', () => {
    downloadAndExtractGame();
});

// If you want to send a message to the renderer process
// mainWindow.webContents.send('some-event', 'Hello from main!');

// Call the checkForUpdates function when the Electron app starts
checkForUpdates();
