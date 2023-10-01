import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//componentes
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthComponent } from './components/auth/auth.component';
import { ValidEmailComponent } from './components/valid-email/valid-email.component';
import { RequestPassComponent } from './components/request-pass/request-pass.component';
import { QuienessomosComponent } from './components/quienessomos/quienessomos.component';

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'Register', component: RegisterComponent },
    { path: 'Auth', component: AuthComponent },
    { path: 'Recover/Password', component: RequestPassComponent },
    { path: 'Valid/Email', component: ValidEmailComponent },
    { path: 'Info', component: QuienessomosComponent },
    { path: '**', component: HomeComponent }
]

//exportar el modulo del router
export const appRoutingProviders: any[]=[];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);