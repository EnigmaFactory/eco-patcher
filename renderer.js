const { ipcRenderer } = require('electron');

// Use the DOMContentLoaded event to wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {

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

    const settings = document.querySelector('.settings');
    const patchNotes = document.getElementById('.patchNotes');
    
    let gearIcon = document.querySelector('.gear-icon');
    let patchIcon = document.querySelector('.patch-icon');
    
    if(gearIcon) {
        gearIcon.addEventListener('click', function() {
            toggleVisibility('.settings');
            hide('.patchNotes');
        });
    }
    
    if(patchIcon) {
        patchIcon.addEventListener('click', function() {
            toggleVisibility('.patchNotes');
            hide('.settings');
        });
    }
    
    function toggleVisibility(selector) {
        const el = document.querySelector(selector);
        if (el.classList.contains('hidden')) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    }
    
    function hide(selector) {
        const el = document.querySelector(selector);
        if (!el.classList.contains('hidden')) {
            el.classList.add('hidden');
        }
    }
    

    fetchPatchNotes()
});

function fetchPatchNotes() {
    fetch('https://evercraftonline.com/patchNotes')
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.text();
        })
        .then(data => {
            // Extract content between the patch notes comments
            const patchNotesRegex = /<!--PATCH NOTES START-->([\s\S]*?)<!--PATCH NOTES END-->/;
            const match = data.match(patchNotesRegex);
            if (match && match[1]) {
                document.getElementById('patchNotes').innerHTML = match[1].trim();
            } else {
                throw new Error("Could not extract patch notes");
            }
        })
        .catch(error => {
            console.error("Error fetching patch notes:", error);
            document.getElementById('patchNotes').innerText = "Failed to load patch notes.";
        });
}