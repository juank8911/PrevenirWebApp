import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routing, appRoutingProviders } from './app.routing';



// Componentes
import { AppComponent } from './app.component';
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
import { InformacionComponent } from './agregar-servicio/components/informacion/informacion.component';
import { HorarioComponent } from './agregar-servicio/components/horario/horario.component';
import { ImagenesComponent } from './agregar-servicio/components/imagenes/imagenes.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { GestionarServiciosComponent } from './components/gestionar-servicios/gestionar-servicios.component';
import { CalendarioCitasComponent } from './components/calendario-citas/calendario-citas.component';
import { GestionarCitasComponent } from './components/gestionar-citas/gestionar-citas.component';
import { AprobarPublicacionesComponent } from './components/aprobar-publicaciones/aprobar-publicaciones.component';
import { ContactenosRootComponent } from './components/contactenos-root/contactenos-root.component';
import { SlidersRootComponent } from './components/sliders-root/sliders-root.component';
import { ListadoPacientesComponent } from './components/listado-pacientes/listado-pacientes.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistroComponent,
    GestionarPublicacionesComponent,
    GestionarMedicosComponent,
    ContactenosComponent,
    TerminosYCondicionesComponent,
    HomeComponent,
    BuscarCitaComponent,
    SlidersComponent,
    OrdenLlegadaComponent,
    InformacionComponent,
    HorarioComponent,
    ImagenesComponent,
    PerfilComponent,
    GestionarServiciosComponent,
    CalendarioCitasComponent,
    GestionarCitasComponent,
    AprobarPublicacionesComponent,
    ContactenosRootComponent,
    SlidersRootComponent,
    ListadoPacientesComponent
  ],
  imports: [
    BrowserModule,
    routing,
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }