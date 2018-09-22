import { Injectable, ApplicationRef } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ElectronService } from 'ngx-electron';
import { Observable } from 'rxjs'
import { LocalStorage } from 'ngx-store'
import { Config } from '../interfaces/config'

@Injectable({
  providedIn: 'root'
})
export class EbayStateService {
  
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

  public get isSandbox(): boolean {
    return this._isSandbox
  }
  public set isSandbox(b: boolean) {
    console.info('isSandbox set to: '+b.toString())
    this._isSandbox = b
  }

  public get sandboxRefreshTokenExp(): Date {
    return this._sandboxRefreshTokenExp
  }

  public get liveRefreshTokenExp(): Date {
    return this._productionRefreshTokenExp
  }

  private config: Observable<Object>
  public configsLoaded: boolean

  constructor(public _http: HttpClient, public _electronService: ElectronService, public ref: ApplicationRef) {
    this.configsLoaded = false
    this.config = this._http.get('assets/config.json')
    this.config.subscribe((res: any) => {
      this.productionConfig = res.ebay
      this.sandboxConfig = res.ebaysandbox
      this.configsLoaded = true

      // IPC RECEPTION STATION
      this._electronService.ipcRenderer.on('tokens-received', (e, tokens) => {
        this.refreshToken = tokens.refresh_token
        this.refreshTokenExp = new Date(Date.now()+(tokens.refresh_token_expires_in*1000))
        this.accessToken = tokens.access_token
        this.accessTokenExp= new Date(Date.now()+(tokens.expires_in*1000))
        this.ref.tick()
      })
      this._electronService.ipcRenderer.on('token-renewed', (e, tokens) => {
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

  // public toggleEnv() {
  //   this.isSandbox = !this.isSandbox
  // }



  // private fullAuthUrl() {
  //   let scope = encodeURIComponent(
  //             this.runningConfig.scope
  //             .reduce((acc, val)=> acc+' '+val)
  //             //.trim()
  //           )
  //   return  this.runningConfig.authorizeUrl
  //         +"?client_id="+this.runningConfig.clientId
  //         +"&response_type=code"
  //         +"&redirect_uri="+this.runningConfig.ruName
  //         +"&scope="+scope
  // }
  
}
