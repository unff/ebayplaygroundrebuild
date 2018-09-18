
generate tokens
pass tokens back through IPC
Angular handles local storage and persistence.

- click the gear
- get code through electron
- turn code into token(s) in electron
- pass tokens back to Angular
- angular sets localstorage values

Do we pass the config from Angular to Electron then?  Electron just generates tokens based on the config from Angular?

You should always have the option of generating a new set of tokens at any time

Angular handles the data.  Electron handles the windows and given functionality

Is WebStorageModule required on app.module?

Any call to an Angular process should hinge on whether we are running in Electron or not. ngx-electron has such a flag.
Will eventually want an external token API for non-Electron web app.