import { Component, ChangeDetectorRef } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { EbayService } from "./services/ebay.service";

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
    console.log(`sandbox: ${this._ebayService.isSandbox}`)
    console.info('runningConfig: ')
    console.log(this._ebayService.runningConfig)
    this._electronService.ipcRenderer.send('do-auth',this._ebayService.runningConfig)
  }

  public authenticated(sandbox: Boolean): String {
    if (sandbox) {
      return new Date(this._ebayService.sandboxRefreshTokenExp).getTime() > new Date().getTime() ? ' ✔' : ''
    } else {
      return new Date(this._ebayService.liveRefreshTokenExp).getTime() > new Date().getTime() ? ' ✔' : ''
    }
  }

}
