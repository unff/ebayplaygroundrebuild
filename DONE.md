Create a config object, or copy it over from the previous project

trigger authWindow from the ng view
where does the redirect listener go?

instead of trying and failing to use remote to include the exports from main.js, let's try ipcRenderer instead.

will-navigate not firing on redirect.  can't claim code.
too tired to keep pounding at it.
This was due to there being an initial reditrect.  did-get-redirect-request solved that.

✓ - generate tokens
✓ - pass tokens back through IPC
✓ - Angular handles local storage and persistence.

- click the gear
- get code through electron
- turn code into token(s) in electron
- pass tokens back to Angular
- angular sets localstorage values

YES: Do we pass the config from Angular to Electron then?  Electron just generates tokens based on the config from Angular?

OK: You should always have the option of generating a new set of tokens at any time

✓ Angular handles the data.  Electron handles the windows and given functionality

NOPE: Is WebStorageModule required on app.module?

Start
Electron creates window
Electron loads ng app into window
ng loads configs
ng checks refresh token(s)
if the refresh token is still good, generate new access token (even if it's still good)

✓ got the currently running config into the main process.  need to hook the logic into the ng app.
✓ then need to turn code into tokens
✓ then need to send tokens and expirations back through IPC
✓ then need to set them in localstorage
✓ tokens not being set in LocalStorage for some reason
✓ The reason is that ipcRenderer isn;t getting them.  Stupid IPC crap.
✓ I missed an event in the callback.  fixed now.

FIXT: Now sandbox doesn't work.  Live does, but sandbox does not generate tokens.
✓ - was stupid.  forgot to base the token call on the config passed in.

✓ - Cleanup!  Split IPC and helper functions into their own files

✓ Replace tokens in the main content area with checkmarks if we have a valid refresh token

✓ On startup, check the access token.  if it's past expiration, generate a new one with helper.refreshToken()
✓ - will have to create a new IPC channel for this.
✓ - renewToken() on app.component will do this.  Just need to hook it into startup. - hooked into swapEnv()