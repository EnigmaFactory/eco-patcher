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

document.querySelector('.gear-icon').addEventListener('click', () => {
    const settings = document.querySelector('.settings');
    if (settings.classList.contains('hidden')) {
        settings.classList.remove('hidden');
    } else {
        settings.classList.add('hidden');
    }
});


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

window.onload = function() {
    fetch('https://evercraftonline.com/patchNotes')
        .then(response => {
            if(!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.text();
        })
        .then(data => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(data, 'text/html');
            let notes = doc.querySelector('#notesSectionTag');
            document.getElementById('patchNotes').innerHTML = notes ? notes.innerHTML : "Couldn't fetch patch notes";
        })
        .catch(error => {
            console.error("Error fetching patch notes:", error);
            document.getElementById('patchNotes').innerText = "Failed to load patch notes.";
        });
}



