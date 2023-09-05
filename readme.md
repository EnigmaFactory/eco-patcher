# EverCraft Online Patcher

The official patcher for EverCraft Online, built using Electron. This patcher ensures players have the latest version of the game by checking with the game's server for updates. If a newer version is detected, it downloads and extracts the necessary files. Once everything is up to date, the patcher launches the game.

![Patcher Screenshot](./screenshot.png) <!-- You can replace this with an actual screenshot of your patcher -->

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) - The JavaScript runtime.
- [npm](https://www.npmjs.com/) - The package manager for Node.js.

### Installation

1. Clone this repository:
   ```git clone https://github.com/YourUsername/eco-patcher.git```

2. Navigate to the cloned directory:

```cd eco-patcher```

3. Install the necessary dependencies:

```npm install```

## 🖥️ Usage

### Running the Patcher

In the project directory, run:
```npm start```

This command starts the Electron app, invoking the main script specified in the package.json (by default, index.js). The patcher then checks the server for updates, downloads and extracts them if necessary, and launches the game.

### Debugging
For development purposes, the Chrome Developer Tools are enabled. They can be accessed within the Electron app to inspect elements, view console logs, and debug scripts.

## 📖 Overview
This patcher performs the following tasks:

- Checks the game's server for the latest version.
- Compares the server's version with the local version.
- If the versions do not match:
    - Downloads the updated game files.
    - Extracts the files.
- Launches the game.
- It is styled to match the aesthetic of the EverCraft Online website.
