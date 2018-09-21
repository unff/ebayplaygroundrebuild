# Instructions
    Code install:
    - git clone (this repo)
    - cd ebayplayground
    - npm install
    Run local:
    - npm run electron (ng dev build)
    - npm run eprod (ng production build)
    Create an installer:
    - npm run dist

# Notes
<pre>
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

✓ - Angular handles the data.  Electron handles the windows and given functionality

NOPE: Is WebStorageModule required on app.module?

REFACTOR: Any call to an Angular process should hinge on whether we are running in Electron or not. ngx-electron has such a flag.
Will eventually want an external token API for non-Electron web app.

Start
Electron creates window
Electron loads ng app into window
ng loads configs
ng checks refresh token(s)
if the refresh token is still good, generate new access token (even if it's still good)


✓ - got the currently running config into the main process.  need to hook the logic into the ng app.
✓ - then need to turn code into tokens
✓ - then need to send tokens and expirations back through IPC
✓ - then need to set them in localstorage
✓ - tokens not being set in LocalStorage for some reason
✓ - The reason is that ipcRenderer isn;t getting them.  Stupid IPC crap.
✓ - I missed an event in the callback.  fixed now.

FIXT: Now sandbox doesn't work.  Live does, but sandbox does not generate tokens.
✓ - was stupid.  forgot to base the token call on the config passed in.

OK So now what?
- Fix the layout so the whole token is visible?  Do we really need it at all though??
- Cleanup!  Split IPC and helper functions into their own files

Need controller to not open multiple authWindows (prevent clickSpam)
- what can I trigger off of? replace button with a spinner

Need something to snoop into ebay responses and listen for invalid IAF token, then re-do the token
eBay calls should all go through the electron side via IPC and a helper function

✓ - Replace tokens in the main content area with checkmarks if we have a valid refresh token

On startup, check the access token.  if it's past expiration, generate a new one with helper.refreshToken()

</pre>