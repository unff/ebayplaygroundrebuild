import { Injectable, ApplicationRef } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ElectronService } from 'ngx-electron';
import { Observable, Subscription, Observer } from 'rxjs'
//import { map } from 'rxjs/operators'
import { CookieStorage, LocalStorage, SessionStorage } from 'ngx-store'
import { Config } from '../config'

@Injectable({
  providedIn: 'root'
})
export class EbayService {
  
  private productionConfig: Config
  private sandboxConfig: Config

  public get runningConfig(): Config {
    return this.isSandbox? this.sandboxConfig : this.productionConfig
  }
  
  @LocalStorage() public siteModel: string

  @LocalStorage() private _sandboxAccessToken: string
  @LocalStorage() private _sandboxAccessTokenExp: Date
  @LocalStorage() private _sandboxRefreshToken: string
  @LocalStorage() private _sandboxRefreshTokenExp: Date
  
  @LocalStorage() private _productionAccessToken: string
  @LocalStorage() private _productionAccessTokenExp: Date
  @LocalStorage() private _productionRefreshToken: string
  @LocalStorage() private _productionRefreshTokenExp: Date

  @LocalStorage() private _isSandbox: boolean

  
  
  // getters and setters for tokens and expirations
  // private _authenticated: boolean
  public get authenticated(): boolean {
    if (this.refreshTokenExp) {
      return new Date(this.refreshTokenExp).getTime() > new Date().getTime() ? true : false
    } else {
      return false
    }
  }

  public get accessToken(): string {
    return this.isSandbox? this._sandboxAccessToken : this._productionAccessToken
  }
  public set accessToken(token: string) {
    if(this.isSandbox) {
      this._sandboxAccessToken = token
    } else {
      console.log(`dump acc: ${token}`)
      this._productionAccessToken = token
    }
  }

  public get refreshToken(): string {
    return this.isSandbox? this._sandboxRefreshToken : this._productionRefreshToken
  }
  public set refreshToken(token: string) {
    if(this.isSandbox) {
      this._sandboxRefreshToken = token
    } else {
      console.log(`dump ref: ${token}`)
      this._productionRefreshToken = token
    }
  }

  public get accessTokenExp(): Date {
    return this.isSandbox? this._sandboxAccessTokenExp : this._productionAccessTokenExp
  }
  public set accessTokenExp(d: Date) {
    if(this.isSandbox) {
      this._sandboxAccessTokenExp = d
    } else {
      this._productionAccessTokenExp = d
    }
  }

  public get refreshTokenExp(): Date {
    return this.isSandbox? this._sandboxRefreshTokenExp : this._productionRefreshTokenExp
  }
  public set refreshTokenExp(d: Date) {
    if(this.isSandbox) {
      this._sandboxRefreshTokenExp = d
    } else {
      this._productionRefreshTokenExp = d
    }
  }

  public get isSandbox() {
    return this._isSandbox
  }
  public set isSandbox(b: boolean) {
    console.info('isSandbox set to: '+b.toString())
    this._isSandbox = b
  }

  private config: Observable<Object>
  public configsLoaded: boolean

  constructor(private _http: HttpClient, private _electronService: ElectronService, private ref: ApplicationRef) {
    this.configsLoaded = false
    this.config = this._http.get('assets/config.json')
    this.config.subscribe((res: any) => {
      this.productionConfig = res.ebay
      this.sandboxConfig = res.ebaysandbox
      // this.refreshAccessToken
      // this.refreshSandboxAccessToken()
      // this.refreshProductionAccessToken()
      this.configsLoaded = true
      // IPC SECTION
      this._electronService.ipcRenderer.on('tokens-received', (e, tokens) => {
        console.log('TOKENS IN EBAY SERVICE')
        console.log(tokens)
        this.refreshToken = tokens.refresh_token
        this.refreshTokenExp = new Date(Date.now()+(tokens.refresh_token_expires_in*1000))
        this.accessToken = tokens.access_token
        this.accessTokenExp= new Date(Date.now()+(tokens.expires_in*1000))
        this.ref.tick()
      })
    })

    if (this.isSandbox == null) {
      console.log('isSandBox defaulting to true')
      //first run (null variable) defaults to Sandbox
      this.isSandbox = true
      this.siteModel = 'EBAY_US'
    } else { // we've been here before.  load previous values and set token expirations.
      // weeeeird @LocalStorage issue where var doesnt register a value on until set?.  WTF.
      console.log('weird @LocalStorage bug')
      this.isSandbox = this.isSandbox
      this.siteModel = this.siteModel
      this._sandboxAccessToken = this._sandboxAccessToken
      this._sandboxRefreshToken = this._sandboxRefreshToken
      this._sandboxAccessTokenExp = this._sandboxAccessTokenExp
      this._sandboxRefreshTokenExp = this._sandboxRefreshTokenExp
      this._productionAccessToken =  this._productionAccessToken
      this._productionRefreshToken =  this._productionRefreshToken
      this._productionAccessTokenExp = this._productionAccessTokenExp
      this._productionRefreshTokenExp = this._productionRefreshTokenExp
    }
  }

  public toggleEnv() {
    this.isSandbox = !this.isSandbox
  }

  public swapEnv(b: boolean) {
    this.isSandbox = b
  }

  private fullAuthUrl() {
    let scope = encodeURIComponent(
              this.runningConfig.scope
              .reduce((acc, val)=> acc+' '+val)
              //.trim()
            )
    return  this.runningConfig.authorizeUrl
          +"?client_id="+this.runningConfig.clientId
          +"&response_type=code"
          +"&redirect_uri="+this.runningConfig.ruName
          +"&scope="+scope
  }
  
  // /// AUGH. Have to refresh these from separate calls
  // public refreshSandboxAccessToken() {
  //   if (new Date(this._sandboxAccessTokenExp).getTime() - 45000 > new Date().getTime()) {
  //     return false
  //   }
  //   // use refresh token to get a new access token
  //   console.log('refreshing sandbox access token')
  //   let scope = encodeURIComponent(
  //     this.sandboxConfig.scope
  //     .reduce((acc, val)=> acc+' '+val)
  //     //.trim()
  //   )
  //   let encodedToken: string = btoa(this.sandboxConfig.clientId+":"+this.sandboxConfig.secret)
  //   let body = "grant_type=refresh_token&refresh_token="+this._sandboxRefreshToken+"&scope="+scope
  //   let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
  //                                   .set('Authorization', 'Basic '+encodedToken)
  //   this._http.post(this.sandboxConfig.accessUrl,body,{headers: headers})
  //     .subscribe(res => {
  //       console.log('sandbox token response received')
  //       console.log(res)
  //       this._sandboxAccessToken = res['access_token']
  //       this._sandboxAccessTokenExp= new Date(Date.now()+(res['expires_in']*1000))
  //       console.log(res['access_token'] == this._sandboxAccessToken)
  //       this.startSandboxTimer(res['expires_in'])
  //     })
  // }

  // public refreshProductionAccessToken() {
  //   if (new Date(this._productionAccessTokenExp).getTime() - 45000 > new Date().getTime()) {
  //     return false
  //   }
  //   // use refresh token to get a new access token
  //   console.log('refreshing production access token')
  //   let scope = encodeURIComponent(
  //     this.productionConfig.scope
  //     .reduce((acc, val)=> acc+' '+val)
  //     //.trim()
  //   )
  //   let encodedToken: string = btoa(this.productionConfig.clientId+":"+this.productionConfig.secret)
  //   let body = "grant_type=refresh_token&refresh_token="+this._productionRefreshToken+"&scope="+scope
  //   let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
  //                                   .set('Authorization', 'Basic '+encodedToken)
  //   this._http.post(this.productionConfig.accessUrl,body,{headers: headers})
  //     .subscribe(res => {
  //       console.log('production token response received')
  //       console.log(res)
  //       this._productionAccessToken = res['access_token']
  //       this._productionAccessTokenExp= new Date(Date.now()+(res['expires_in']*1000))
  //       this.startProductionTimer(res['expires_in'])
  //     })
  // }

  
  
  // public doLogout() {
  //   this.sandboxExpiresTimerId = null
  //   this.productionExpiresTimerId = null
  //   this.accessTokenSeconds = 0
  //   this.token = null
  //   //this.emitAuthStatus(true)
  //   console.log('Session has been cleared')
  // }

  // public subscribe(onNext: (value: any) => void, onThrow?: (exception: any) => void, onReturn?: () => void) {
  //   return this.locationWatcher.subscribe(onNext, onThrow, onReturn)
  // }

  // public isAuthenticated() {
  //   // refresh token good?
  //   return this.authenticated
  // }

  // private emitAuthStatus(success: boolean) {
  //   this.emitAuthStatusError(success, null)
  // }

  // private emitAuthStatusError(success: boolean, error: any) {
  //   this.locationWatcher.emit(
  //     {
  //       success: success,
  //       authenticated: this.isAuthenticated(),
  //       refreshTokenExpires: this.refreshTokenExp,
  //       acessTokenExpires: this.accessTokenExp,
  //       error: error
  //     }
  //   )
  // }

  // private parse(str) { // lifted from https://github.com/sindresorhus/query-string
  //   if (typeof str !== 'string') {
  //     return {}
  //   }
  //   console.log('str: '+str)
  //   str = str.trim().replace(/^(\?|#|&)/, ''); // If the string starts with one of these three chars (?#&), remove it.

  //   if (!str) {
  //     return {}
  //   }

  //   return str.split('&').reduce(function (ret, param) {
  //     let parts = param.replace(/\+/g, ' ').split('=')
  //     // Firefox (pre 40) decodes `%3D` to `=`
  //     // https://github.com/sindresorhus/query-string/pull/37
  //     let key = parts.shift()
  //     //console.log(key)
  //     let val = parts.length > 0 ? parts.join('=') : undefined

  //     key = decodeURIComponent(key)

  //     // missing `=` should be `null`:
  //     // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
  //     val = val === undefined ? null : decodeURIComponent(val)

  //     if (!ret.hasOwnProperty(key)) {
  //       ret[key] = val
  //     } else if (Array.isArray(ret[key])) {
  //       ret[key].push(val)
  //     } else {
  //       ret[key] = [ret[key], val]
  //     }

  //     return ret
  //   }, {})
  // }
}
