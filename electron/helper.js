const { net } = require("electron")
const url = require("url")

function fullAuthURL(config) {
  // creates an authorization URL from the config object passed into it.  
  // See src/assets/config.json for config file
    let scope = encodeURIComponent(
      config.scope
      .reduce((acc, val)=> acc+' '+val)
      //.trim()
    )
    return  config.authorizeUrl
            +"?client_id="+config.clientId
            +"&response_type=code"
            +"&redirect_uri="+config.ruName
            +"&scope="+scope
    }
  
  function oauthCallback(url, window, ipcEvent, config) {
    // AuthWin loads the renderer with the fullAuthUrl (see above) and the authUrl will redirect you to
    // the callback (ruName) with a code attached.  This function catches any redirects and looks for the code
    // so the ruName callback URL is moot as far as we're concerned.  We just care about "code="

    // regex!  ebay returns a code good for 5 minutes you can use to create a token set.  search the redirect URL for "code="
    let raw_code = /code=([^&]*)/.exec(url)
    let code = (raw_code && raw_code.length > 1) ? raw_code[1]: null // assuming a code was returned, set code equal to the first capture group (the bit after 'code=')
    let error = /\?error=(.+)$/.exec(url)
    if (code || error) {
      window.close()  // regex returned a code or an error, so the authWindow is no longer needed.
    }
    if (code) {
      // do code related things
      requestTokensFromCode(code, ipcEvent, config)
    } else if (error) {
      // do error related things using error[1]
      console.log(`error: ${error}`)  // TODO: This needs to get an IPC treatment as the electron console will not ve available.
    } // no code, no error. Do nothing and let electron proceed with the redirect.
  }
  
  function requestTokensFromCode(code, ipcEvent, config) { // only used in helper.js so no need to export it.
    // this thing needs to take the code returned and make a token set out of it.
    // Set tokens to localStorage? no - return them to ng so it can store them.
    let tokenURL = url.parse(config.accessUrl) // The config object has a full URL, we need pieces.  Use url.parse() to parse it.
    // btoa doesnt exist in node, throw the auth credentials in a buffer and stream them into a base64 encoded string
    let authCode = Buffer.from(config.clientId+":"+config.secret).toString('base64') 
    let request = net.request({  // net is remarkably similar to node's http module.
      method: 'POST',
      protocol: tokenURL.protocol,
      hostname: tokenURL.hostname,
      path: tokenURL.path
    })
    request.setHeader('Content-Type','application/x-www-form-urlencoded') // set the header to mimic a form
    request.setHeader('Authorization', `Basic ${authCode}`) // set the auth header.  
    request.end(`grant_type=authorization_code&code=${code}&redirect_uri=${config.ruName}`) // .end takes the body and sends it off.
  
    request.on('response', (response) => { // if the request object gets a response
      let body = '' // initialize the buffer as an empty string
      response.on('data', (chunk)=> { // rebuild the response body from each chunk of data
        body += chunk
      })
      response.on('end', () => {  // got all the data we are going to get.
        var parsed = JSON.parse(body)  // this particular call happens to return a JSON object.
        // ipcEvent has been passed around like a hat waiting for this moment. Send the token back to the calling window:
        ipcEvent.sender.send('tokens-received', parsed) 
      })
  
    })
  }

  function renewAccessToken(token, ipcEvent, config){
    // we need the token to make the call
    // we need the ipcEvent to return the token
    // we need the config to know what URL to use
  }

  // EXPORTS SECTION! Recycle, Reduce, Reuse

  module.exports.fullAuthURL = fullAuthURL
  module.exports.oauthCallback = oauthCallback