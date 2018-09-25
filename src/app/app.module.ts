import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import { EbayStateService } from "./services/ebayState.service"
import { ClarityModule } from '@clr/angular'
import { NgxElectronModule } from 'ngx-electron'
//import { WebStorageModule } from 'ngx-store'
import { AppComponent } from './app.component'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    ClarityModule,
    NgxElectronModule,
    FormsModule,
    //WebStorageModule, // not sure if required
    BrowserModule
  ],
  providers: [
    EbayStateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
