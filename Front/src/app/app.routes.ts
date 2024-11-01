import { Routes } from '@angular/router';
import { LandingComponent } from './compontents/landing/landing.component';
import { CotizacionComponent } from './compontents/cotizacion/cotizacion.component';
import { LoginComponent } from './compontents/login/login.component';
import { SingupComponent } from './compontents/singup/singup.component';
import { HistorialComponent } from './compontents/historial/historial.component';

export const routes: Routes = [

    { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirige a 'home' por defecto
    { path: 'home', component: LandingComponent }, // Ruta para el componente de la página principal
    { path: 'historial', component: HistorialComponent }, // Ruta para el componente para realiar cotizaciones
    { path: 'login', component: LoginComponent }, // Ruta para el componente para realiar cotizaciones
    { path: 'signup', component: SingupComponent }, // Ruta para el componente para realiar cotizaciones
    { path: 'cotizacion', component: CotizacionComponent},
    { path: '**', component: LandingComponent }, // Manejo de rutas no encontradas (404)

];
