import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routing, appRoutingProviders } from './app.routing';

// Modulos

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

 

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
import { PerfilComponent } from './components/perfil/perfil.component';
import { CalendarioCitasComponent } from './components/calendario-citas/calendario-citas.component';
import { GestionarCitasComponent } from './components/gestionar-citas/gestionar-citas.component';
import { AprobarPublicacionesComponent } from './components/aprobar-publicaciones/aprobar-publicaciones.component';
import { ContactenosRootComponent } from './components/contactenos-root/contactenos-root.component';
import { SlidersRootComponent } from './components/sliders-root/sliders-root.component';
import { ListadoPacientesComponent } from './components/listado-pacientes/listado-pacientes.component';
import { BarraNavegacionComponent } from './components/barra-navegacion/barra-navegacion.component';
import { FooterComponent } from './components/footer/footer.component';
import { VerPerfilMedicoComponent } from './components/ver-perfil-medico/ver-perfil-medico.component';
import { ModalVerPublicacionComponent } from './components/modal-ver-publicacion/modal-ver-publicacion.component';
import { ModalCrearMedicoComponent } from './components/modal-crear-medico/modal-crear-medico.component';
import { ModalAgregarEstudioMedicoComponent } from './components/modal-agregar-estudio-medico/modal-agregar-estudio-medico.component';
import { ModalVerCitaComponent } from './components/modal-ver-cita/modal-ver-cita.component';
import { ModalCrearEstudioMedicoComponent } from './components/modal-crear-estudio-medico/modal-crear-estudio-medico.component';
import { CrearPublicacionComponent } from './components/crear-publicacion/crear-publicacion.component';

// Servicios
import { ProvedorService } from './services/provedor.service';
import { Global } from './services/global';
import { UserService } from './services/user.service';
import { UserGuard } from './services/user.guard';

// Modulo de loader
import { NgxLoadingModule } from 'ngx-loading';


// Pipes
import { FechaPipe } from './pipes/fechas.pipe';
import { HoraPipe } from './pipes/horas.pipe';
import { CategoriaPipe } from './pipes/categoria.pipe';


// Angular material

import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule,
        MatAutocompleteModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';

// Calendario

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { MedicoService } from './services/medico.service';
import { MisServiciosComponent } from './components/mis-servicios/mis-servicios.component';
import { OlvidoContraseniaComponent } from './components/olvido-contrasenia/olvido-contrasenia.component';
import { ConfirmarCuentaComponent } from './components/confirmar-cuenta/confirmar-cuenta.component';

registerLocaleData(localeEs);


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
    PerfilComponent,
    CalendarioCitasComponent,
    GestionarCitasComponent,
    AprobarPublicacionesComponent,
    ContactenosRootComponent,
    SlidersRootComponent,
    ListadoPacientesComponent,
    BarraNavegacionComponent,
    FooterComponent,
    VerPerfilMedicoComponent,
    ModalVerPublicacionComponent,
    ModalCrearMedicoComponent,
    ModalAgregarEstudioMedicoComponent,
    ModalVerCitaComponent,
    ModalCrearEstudioMedicoComponent,
    FechaPipe,
    HoraPipe,
    CategoriaPipe,
    CrearPublicacionComponent,
    MisServiciosComponent,
    OlvidoContraseniaComponent,
    ConfirmarCuentaComponent,
  ],
  imports: [
    BrowserModule,
    routing,
    HttpClientModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule, MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCardModule,
    BrowserAnimationsModule,
    ScrollDispatchModule,
    NgxLoadingModule.forRoot({}),
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    FormsModule,
    FlatpickrModule.forRoot()
  ],
  providers: [
    appRoutingProviders,
    ProvedorService,
    UserGuard,
    UserService,
    Global
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
