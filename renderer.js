const { ipcRenderer } = require('electron');

const statusDiv = document.getElementById('status');
const progressBar = document.getElementById('progressBar');

ipcRenderer.on('download-progress', (event, percentage) => {
    updateProgress(percentage);
    updateMessage(`Downloading: ${percentage.toFixed(2)}%`);
});

ipcRenderer.on('download-error', (event, message) => {
    updateMessage(message);
    // Possibly display an error pop-up or change the UI to indicate an error
});

function updateMessage(message) {
    statusDiv.textContent = message;
}

function updateProgress(percentage) {
    progressBar.value = percentage;
}

let isPaused = false;

document.getElementById('pauseResumeButton').addEventListener('click', () => {
    if (isPaused) {
        ipcRenderer.send('resume-download');
        isPaused = false;
    } else {
        ipcRenderer.send('pause-download');
        isPaused = true;
    }
});

ipcRenderer.on('download-paused', () => {
    document.getElementById('pauseResumeButton').textContent = 'Resume';
});

ipcRenderer.on('download-resumed', () => {
    document.getElementById('pauseResumeButton').textContent = 'Pause';
});

