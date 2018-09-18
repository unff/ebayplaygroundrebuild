import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { EbayService } from "./services/ebay.service";
import { ClarityModule } from '@clr/angular';
import { NgxElectronModule } from 'ngx-electron';
import { WebStorageModule } from 'ngx-store';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ClarityModule,
    NgxElectronModule,
    WebStorageModule, // not sure if required
    BrowserModule
  ],
  providers: [
    EbayService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
