import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// el routing
import { routing, appRoutingProviders } from './app.routing';

import { ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthComponent } from './components/auth/auth.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RequestPassComponent } from './components/request-pass/request-pass.component';
import { ValidEmailComponent } from './components/valid-email/valid-email.component';
import { AddRegsitroComponent } from './components/add-regsitro/add-regsitro.component';
import { AddUpdateEventComponent } from './components/add-update-event/add-update-event.component';
import { QuienessomosComponent } from './components/quienessomos/quienessomos.component';
import { TerminosCondicionesComponent } from './components/terminos-condiciones/terminos-condiciones.component';
import { RegisterDetalleComponent } from './components/register-detalle/register-detalle.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    AuthComponent,
    HeaderComponent,
    FooterComponent,
    RequestPassComponent,
    ValidEmailComponent,
    AddRegsitroComponent,
    AddUpdateEventComponent,
    QuienessomosComponent,
    TerminosCondicionesComponent,
    RegisterDetalleComponent
  ],
  imports: [
    BrowserModule,
    routing,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    appRoutingProviders,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
