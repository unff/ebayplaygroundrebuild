const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

let windows = new Set()

function createWindow() {
  win = new BrowserWindow({ 
    width: 800, 
    height: 600,
    show: false
  });

  // load the dist folder from Angular
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: "file:",
      slashes: true
    })
  );

  win.once('ready-to-show', () => {
    win.show()
  })

  // The following is optional and will open the DevTools:
  // win.webContents.openDevTools()

  win.on("closed", () => {
    win = null;
  });

  windows.add(win)
}

app.on("ready", createWindow);

// on macOS, closing the window doesn't quit the app
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// initialize the app's main window
app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});

// Auth window
const authWindow = exports.authWindow = () => {
  authWin = new BrowserWindow({
    width: 600,
    height: 1000,
    show: false
  })

  authWin.once('ready-to-show', () => {
    authWin.show()
  })

  authWin.loadURL(  ); // Load ebay auth URL

  windows.add(authWin)
}