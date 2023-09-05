const { app, BrowserWindow } = require('electron');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const AdmZip = require('adm-zip');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile('index.html');

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
    axios.get('https://api.evercraftonline.com/versions?newest')
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
            // Handle error or notify the user
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
                // Handle error
            });
        })
        .catch(error => {
            console.error("Error downloading game:", error);
            // Handle error
        });
}

function launchGame() {
    // Adjust this path if necessary based on your extracted structure
    exec('./Client/EverCraftOnline.exe', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
}

// Call the checkForUpdates function when the Electron app starts
checkForUpdates();
