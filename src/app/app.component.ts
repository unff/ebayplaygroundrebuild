import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import {EbayService} from "./services/ebay.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'eBay Playground';

  constructor(private _electronService: ElectronService, private _ebayService: EbayService) {}

  getCode_old() {
    console.log(__dirname)
    let x = this._electronService.remote.require(`${__dirname}/../main.js`)
    console.log('getCode')
    console.log(x)
    x.authWindow()
  }

  getCode() {
    this._electronService.ipcRenderer.send('do-auth',this._ebayService.runningConfig)
  }

}
