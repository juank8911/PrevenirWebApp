import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// componentes

import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { GestionarPublicacionesComponent } from './components/gestionar-publicaciones/gestionar-publicaciones.component';
import { GestionarMedicosComponent } from './components/gestionar-medicos/gestionar-medicos.component';
import { ContactenosComponent } from './components/contactenos/contactenos.component';
import { TerminosYCondicionesComponent } from './components/terminos-y-condiciones/terminos-y-condiciones.component';
import { HomeComponent } from './components/home/home.component';
import { BuscarCitaComponent } from './components/buscar-cita/buscar-cita.component';
import { SlidersComponent } from './components/sliders/sliders.component';
import { OrdenLlegadaComponent } from './components/orden-llegada/orden-llegada.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { CalendarioCitasComponent } from './components/calendario-citas/calendario-citas.component';
import { GestionarCitasComponent } from './components/gestionar-citas/gestionar-citas.component';
import { AprobarPublicacionesComponent } from './components/aprobar-publicaciones/aprobar-publicaciones.component';
import { ContactenosRootComponent } from './components/contactenos-root/contactenos-root.component';
import { SlidersRootComponent } from './components/sliders-root/sliders-root.component';
import { ListadoPacientesComponent } from './components/listado-pacientes/listado-pacientes.component';
import { VerPerfilMedicoComponent } from './components/ver-perfil-medico/ver-perfil-medico.component';
import { CrearPublicacionComponent } from './components/crear-publicacion/crear-publicacion.component';
import { MisServiciosComponent } from './components/mis-servicios/mis-servicios.component';
import { OlvidoContraseniaComponent } from './components/olvido-contrasenia/olvido-contrasenia.component';
import { ConfirmarCuentaComponent } from './components/confirmar-cuenta/confirmar-cuenta.component';
import { HistoriaClinicaComponent } from './components/historia-clinica/historia-clinica.component';
import { TerminosYCondicionesPublicoComponent } from './components/terminos-y-condiciones-publico/terminos-y-condiciones-publico.component';

// Servicios

// Este servicio sirve para restringuir el acceso a los usuarios no authentificados.
import { UserGuard } from './services/user.guard';

const routes: Routes = [
    {path: '', component : LoginComponent},
    {path : 'login', component: LoginComponent},
    {path : 'recuperar-cuenta', component: OlvidoContraseniaComponent},
    {path : 'terminos-y-condiciones', component: TerminosYCondicionesComponent},
    {path : 'registro', component: RegistroComponent},
    {path : 'home', component: HomeComponent, canActivate: [UserGuard]},
    {path : 'confirmar-cuenta', component: ConfirmarCuentaComponent},
    {path : 'publicaciones', component: GestionarPublicacionesComponent, canActivate: [UserGuard]},
    {path : 'medicos', component: GestionarMedicosComponent, canActivate: [UserGuard]},
    {path : 'contactenos', component: ContactenosComponent, canActivate: [UserGuard] },
    {path : 'terminosycondiciones', component: TerminosYCondicionesComponent, canActivate: [UserGuard] },
    {path : 'buscarcita', component: BuscarCitaComponent, canActivate: [UserGuard] },
    {path : 'slider', component: SlidersComponent, canActivate: [UserGuard] },
    {path : 'ordenllegada', component: OrdenLlegadaComponent, canActivate: [UserGuard] },
    {path : 'perfil', component: PerfilComponent, canActivate: [UserGuard] },
    {path : 'calendario', component: CalendarioCitasComponent, canActivate: [UserGuard] },
    {path : 'mis-servicios', component: MisServiciosComponent, canActivate: [UserGuard] },
    {path : 'citas', component: GestionarCitasComponent, canActivate: [UserGuard] },
    {path : 'apropublicaciones', component: AprobarPublicacionesComponent, canActivate: [UserGuard] },
    {path : 'contactenosroot', component: ContactenosRootComponent, canActivate: [UserGuard] },
    {path : 'slidersroot', component: SlidersRootComponent, canActivate: [UserGuard] },
    {path : 'gestionar-pacientes', component: ListadoPacientesComponent, canActivate: [UserGuard]},
    {path : 'vermedico/:id', component: VerPerfilMedicoComponent, canActivate: [UserGuard]},
    {path : 'crear-publicacion', component: CrearPublicacionComponent, canActivate: [UserGuard]},
    {path : 'historia-clinica/:id/:id_servicio', component: HistoriaClinicaComponent, canActivate: [UserGuard]},
    {path: '**', component: LoginComponent}

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports : [ RouterModule ]
})

export class AppRoutingModule { }


