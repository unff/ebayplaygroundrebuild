import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'eBay Playground';

  constructor(private _electronService: ElectronService) {}

  getCode_old() {
    console.log(__dirname)
    let x = this._electronService.remote.require(`${__dirname}/../main.js`)
    console.log('getCode')
    console.log(x)
    x.authWindow()
  }

  getCode() {
    this._electronService.ipcRenderer.send('do-auth',{
      "clientId": "SixBitSo-Stockie-SBX-a090fc79c-80a504d9",
      "secret": "SBX-090fc79c23cb-451f-4990-ba40-6bbc"})
  }

}
