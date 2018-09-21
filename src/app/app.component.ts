import { Component, ChangeDetectorRef } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { EbayService } from "./services/ebay.service";
import { RenewTokenArgs } from "./renew-token-args"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  envModel = this._ebayService.isSandbox ? 'Sandbox' : 'Live'

  constructor(public _electronService: ElectronService, public _ebayService: EbayService) {}

// IPC ZONE
  
  getCode(): void {
    // fire IPC on the 'do-auth' channel, passing the config along
    this._electronService.ipcRenderer.send('do-auth',this._ebayService.runningConfig)
  }

  renewToken(): void {
    // fire IPC off on the 'renew-token' channel, passing the running config and the running refresh token
    let args = {} as RenewTokenArgs
    args.token = this._ebayService.refreshToken
    args.config = this._ebayService.runningConfig
    this._electronService.ipcRenderer.send('renew-token', args)
  }

  // VIEW FUNCTIONS

  public authenticated(sandbox: Boolean): String {
    if (sandbox) {
      return new Date(this._ebayService.sandboxRefreshTokenExp).getTime() > new Date().getTime() ? ' ✔' : ''
    } else {
      return new Date(this._ebayService.liveRefreshTokenExp).getTime() > new Date().getTime() ? ' ✔' : ''
    }
  }

}
