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

  constructor(private _electronService: ElectronService, private _ebayService: EbayService) {}

// IPC ZONE
  
  getCode_old(): void {
    console.log(__dirname)
    let x = this._electronService.remote.require(`${__dirname}/../main.js`)
    console.log('getCode')
    console.log(x)
    x.authWindow()
  }

  getCode(): void {
    console.log(`sandbox: ${this._ebayService.isSandbox}`)
    console.info('runningConfig: ')
    console.log(this._ebayService.runningConfig)
    this._electronService.ipcRenderer.send('do-auth',this._ebayService.runningConfig)
  }

  getAccessToken(): String {
    return this._ebayService.accessToken
  } 

}
