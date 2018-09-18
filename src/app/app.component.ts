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

  getCode() {
    console.log(__dirname)
    let x = this._electronService.remote.require(`${__dirname}/../main.js`)
    console.log('getCode')
    console.log(x)
    x.authWindow()
  }

}
