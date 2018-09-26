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


REFRESH token is the long-lives one used to generate new access tokens

REFACTOR: Any call to an Angular process should hinge on whether we are running in Electron or not. ngx-electron has such a flag.
Will eventually want an external token API for non-Electron web app.


OK So now what?
- Fix the layout so the whole token is visible?  Do we really need it at all though??


Need controller to not open multiple authWindows (prevent clickSpam)
- what can I trigger off of? replace button with a spinner

Need something to snoop into ebay responses and listen for invalid IAF token, then re-do the token
eBay calls should all go through the electron side via IPC and a helper function

Code is about as cleaned up as it can be.  
Time to go play with CouchDB? PouchDB?  One of the dbs?
A database is pretty much the next step for this thing.

IMPLEMENT LOGGING.  Everything's great until it's not.  LOGS.


IMAGES:
copy the image to a zip file in either appdata or programdata?
Use the folder layout where you break out the ID into separate folders
How would this work with pouchdb IDs? they are quite lengthy.
Do I need to store a damned counter for this?
Can I just ignore this and use URLs?

I need a options window.  Pics could be locals or remote, and that needs to be an option.

Import:
GetSellerList - gets a page of running listing IDs
GetMyEbaySelling - not a typo - retrieves listings and counts
GetItem - gets a single listing

info to keep:
account info
- business profiles
- category definitions
- item specific definitions


</pre>