import { Component, OnInit } from '@angular/core'
import { ElectronService } from 'ngx-electron'
import { EbayStateService } from './services/ebayState.service'
import { RenewTokenArgs } from './interfaces/renew-token-args'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  envModel = this._ebayStateService.isSandbox ? 'Sandbox' : 'Live'

  constructor(public _electronService: ElectronService, public _ebayStateService: EbayStateService) {}

  ngOnInit() {
    // If we've got a good refresh token, but the access token is expired, renew the access token
    // but we have to wait a bit for the configs to exist, so use setTimeout()
    window.setTimeout(() => {
      if (this._ebayStateService.accessTokenExp && new Date(this._ebayStateService.accessTokenExp).getTime() < new Date().getTime()) {
        this.renewToken()
      }
    }, 250)
  }

  swapEnv(b: boolean): void {
    this._ebayStateService.isSandbox = b
    if (this._ebayStateService.accessTokenExp && new Date(this._ebayStateService.accessTokenExp).getTime() < new Date().getTime()) {
      this.renewToken()
    }
  }

// IPC ZONE
  
  getCode(): void {
    // fire IPC on the 'do-auth' channel, passing the config along
    this._electronService.ipcRenderer.send('do-auth',this._ebayStateService.runningConfig)
  }

  renewToken(): void {
    // fire IPC off on the 'renew-token' channel, passing the running config and the running refresh token
    const args = {} as RenewTokenArgs
    args.token = this._ebayStateService.refreshToken
    args.config = this._ebayStateService.runningConfig
    this._electronService.ipcRenderer.send('renew-token', args)
  }

  // VIEW FUNCTIONS

  public authenticated(sandbox: Boolean): string {
    if (sandbox) {
      return new Date(this._ebayStateService.sandboxRefreshTokenExp).getTime() > new Date().getTime() ? ' ✔' : ''
    } else {
      return new Date(this._ebayStateService.liveRefreshTokenExp).getTime() > new Date().getTime() ? ' ✔' : ''
    }
  }

}
