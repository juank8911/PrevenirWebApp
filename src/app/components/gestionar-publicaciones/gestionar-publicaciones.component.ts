import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ProvedorService } from '../../services/provedor.service';
import { ApplicationService } from '../../services/app.service';
import { MedicoService } from '../../services/medico.service';
import { appRoutingProviders } from 'src/app/app.routing';
import { Global } from '../../services/global';
import { Router} from '@angular/router';
import { Validators, FormBuilder, FormGroup, FormControl  } from '@angular/forms';

@Component({
  selector: 'app-gestionar-publicaciones',
  templateUrl: './gestionar-publicaciones.component.html',
  styleUrls: ['./gestionar-publicaciones.component.css'],
  providers : [UserService, ProvedorService, Global, ApplicationService, MedicoService]
})
export class GestionarPublicacionesComponent implements OnInit {
  public identity;
  public publications;
  public vacio;
  public loading = false;
  myPos;
  departamentos;
  municipios;
  categorias;
  posisionDtp;
  posisionMnp;
  posisionCtga;
  mncpSelect;
  editInfo;
  imagenesEdit;
  nombreMedico;
  imagenes = [];
  cargarFotos: any;
  public status;
  public statusText;

  // variables para edit
  public ver;
  public campo;
  public precioClientesPrevenir;
  public datosEdit: FormGroup;
  public imagenesBorrar = [];
  public maxCitasHora = [];
  public maxCitas;

  constructor(public _userService: UserService, public _provedorService: ProvedorService, public global: Global,
    private _router: Router, public _aplicationService: ApplicationService, public _medicoService: MedicoService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getIdentity();
    this.maxCitasPorHora();
  }

  getIdentity() {
    this.identity = this._userService.getIdentity();
    this.getPublications(this.identity.id_provedor);
  }

  getPublications(id) {
    this.loading = true;

    this._provedorService.getPublications(id).subscribe( (response) => {

        this.publications = response;
        console.log(this.publications);

      if (this.publications[0].vacio === true) {
        this.vacio = true;
        console.log(this.vacio);
      }
      this.loading = false;
    }, (err) => {
      this.loading = false;
      this.status = 'error';
      this.statusText = 'Error en la conexión, Por favor revisa tu conexión o intentalo más tarde.';
      console.log(err);
    });
  }

  crearPublicacion() {
    this.loading = true;
    let id = this._userService.getIdentity();
    id = id.id_provedor;
    console.log(id);
    this._provedorService.getMedicosProvedor(id).subscribe( (res) => {
      console.log(res);
      this.loading = false;
      if ( res.length <= 0) {
        console.log('no hay medicos');
        document.getElementById('openModalButton').click();
      } else {
        this._router.navigate(['/crear-publicacion']);
      }
    }, (err) => {
      console.log(err);
      this.loading = false;
      this.status = 'error';
      this.statusText = 'Error en la conexión, Por favor revisa tu conexión o intentalo más tarde.';
    } );
  }

  crearMedico() {
    this._router.navigate(['/medicos']);
  }

  // hola() {
  //   console.log('toy funcionando');
  // }

  verPublicacion(id_publicacion) {

    this.editInfo = null;
    this.imagenes = [];
    this.cargarFotos = false;
    this.status = null;

    this._provedorService.getInfoEditar(id_publicacion).subscribe( (response) => {
      console.log(response);
      this.editInfo = response;
      this.getDepartamento(response.depar);
      this.getMunicipio(response.id_departamento, response.id_muni);
      this.getCategoria();
      this.getMedico(response.medico_id);
      this.precioClientesPrevenir = response.precio_cliente_prevenir;
      this.validacionesDatosEdit();
      this.maxCitas = response.max_citas_ves;
      this.maxCitasPorHora();

    }, (err) => {
      console.log(err);
    });

    this._provedorService.getFotosServicio(id_publicacion).subscribe( (response) => {
      console.log(response);
      this.imagenesEdit = response;
      this.validacionImagenes();
    }, (err) => {
      console.log(err);
    });

  }

  getMedico(id) {
    this._medicoService.getInfoMedico(id).subscribe( response => {
      // console.log(response);
      this.nombreMedico = response[0].nombres + ' ' + response[0].apellidos;
    }, (err) => {
      console.log(err);
    });
  }

  getDepartamento(nombre) {
    this._aplicationService.getDepartamento().subscribe( (response) => {
      // console.log(response);
      this.departamentos = response;

      if (this.departamentos !== null || this.departamentos !== undefined) {
        this.posisionDpt(nombre);
      }
    }, (err) => {
      console.log(err);
    });
  }

  getMunicipio(id_depar, id_municipio) {

    this.posisionMnp = null;
    this._aplicationService.getMunicipio(id_depar).subscribe( (response) => {
      // console.log(response);
      this.municipios = response;

      if (this.municipios !== null || this.municipios !== undefined) {

        if (id_municipio !== undefined) {

          for (let i = 0; i < this.municipios.length ; i++) {

            let posision = this.municipios[i].id_municipio;

            if (posision === id_municipio) {
              this.posisionMnp = i;
              this.mncpSelect = id_municipio;
            }
          }
        }
        // console.log(this.posisionMnp);
      }

    }, (err) => {
      console.log(err);
    });

  }

  departamentoSelect(ev, campo) {
    console.log(ev.target.value);
    this.getMunicipio(ev.target.value, undefined);
    this.campo = document.getElementById(campo);
    this.campo.disabled = true;
  }

  municipioSelect(ev, campo) {
    this.mncpSelect = ev.target.value;
    this.campo = document.getElementById(campo);
    this.campo.disabled = true;
  }

  getCategoria() {

    this._aplicationService.getCategorias().subscribe( (response) => {
      // console.log(response);
      this.categorias = response;
    }, (err) => {
      console.log(err);
    });
  }


  posisionDpt(nombre) {

    // console.log(nombre);

    for ( let i = 0 ; i < this.departamentos.length; i++) {

      let posision = this.departamentos[i].nombre;

      if (nombre === posision) {
        this.posisionDtp = i;
        var departamento = this.departamentos[i].id_departamento;
      }
    }

}

maxCitasPorHora() {

  this.maxCitasHora = [{valor : 1}, {valor : 2}, {valor : 3}, {valor : 4}, {valor : 5 }];
}

eliminarImagen(index, id, ruta) {
  console.log(index, id, ruta);
  // this.validacionImagenes(false);
  let resultado = this.imagenes.length + this.imagenesEdit.length;
  if (resultado <= 1) {
    // console.log('El servicio debe tener al menos una imagen');
    this.status = 'error';
    this.statusText = 'El servicio debe tener al menos una imagen';
  } else {
    this.imagenesEdit.splice(index, 1);
    this.imagenesBorrar.push({id: id, ruta: ruta});
    this.cargarFotos = false;
  }
}

eliminarImagenNueva(i) {

  let resultado = this.imagenes.length + this.imagenesEdit.length;
  if (resultado <= 1) {
    // console.log('El servicio debe tener al menos una imagen');
    this.status = 'error';
    this.statusText = 'El servicio debe tener al menos una imagen';
  } else {
    this.imagenes.splice(i, 1);
    this.cargarFotos = false;
  }
 }

// --------------------------- ------ EDITAR CAMPOS ----------------------------------------------

mouseEnter(campo) {
  this.ver = campo;
}

mouseLeave() {
  this.ver = '';
}

cambio(campo) {
  this.campo = document.getElementById(campo);
  this.campo.readOnly = true;

  if (campo === 'precio' || campo === 'descuento') {

    let porcentaje = this.datosEdit.value.descuento / 100;
    porcentaje = this.datosEdit.value.precio * porcentaje;

    this.precioClientesPrevenir = porcentaje;

    console.log(this.precioClientesPrevenir);
  }
}

editar(campo) {
  this.campo = document.getElementById(campo);
  this.campo.readOnly = false;
}

editarSelect(campo) {
  // console.log(campo);
  this.campo = document.getElementById(campo);
  this.campo.disabled = false;
}

cambioSelect(ev, campo) {
  this.campo = document.getElementById(campo);
  this.campo.disabled = true;
  this.maxCitas = ev.target.value;
}

validacionesDatosEdit() {
  this.datosEdit = this.formBuilder.group({
    nombre: [this.editInfo.nombre, [Validators.required, Validators.minLength(4), Validators.maxLength(100)]],
    duracion : [ this.editInfo.duracion, [Validators.required, Validators.max(60), Validators.min(15)]],
    precio: [this.editInfo.precio, [Validators.required, Validators.min(0), Validators.pattern('[0-9]*')]],
    descuento: [this.editInfo.descuento, [Validators.max(100), Validators.min(0),  Validators.pattern('[0-9]*')]],
    video : [ this.editInfo.video],
    direccion : [this.editInfo.direccion, [Validators.required, Validators.maxLength(60)]],
    descripcion: [this.editInfo.descripcion, [Validators.required, Validators.minLength(40)]],
  });
}


// ------------------------------- CARGAR IMAGENES ----------------------------------------------------

openGalery(evt) {
  // console.log(evt);
  var files = evt.target.files;
  var file = files[0];

  // console.log(file.name.split('\.'));

  let validacionImagen = file.name.split('\.');
  let num = validacionImagen.length;

    for (var i = 0; i < validacionImagen.length; i++) {
      if (num = i) {
        var tipoImg = validacionImagen[i];
      }
    }

    if (tipoImg === 'png' || tipoImg === 'jpg' || tipoImg === 'jpeg') {
      console.log('si es imagen');

      if (files && file) {
        var reader = new FileReader();

        reader.onload = this._handleReaderLoaded.bind(this);

        reader.readAsBinaryString(file);
       }

    } else {
      // this.statusImgs = true;
      // this.textoStatus = 'Solo se admiten imagenes, Por favor selecciona una';
    }
}

_handleReaderLoaded(readerEvt) {
  var binaryString = readerEvt.target.result;
  // this.base64textString = btoa(binaryString);
  // console.log(btoa(binaryString));
  // console.log(this.base64textString);
  this.imagenes.push({base64Image: 'data:image/jpeg;base64,' + btoa(binaryString)});
  console.log(this.imagenes);
  this.validacionImagenes();
 }

 validacionImagenes() {

  // let bol = true;
  let resultado = this.imagenesEdit.length + this.imagenes.length;

  if (resultado >= 6) {
    this.cargarFotos = true;
  }

 }

 editarServicio() {

  var imagenes: any;

  if (this.imagenes.length === 0 ) {
    console.log('no hay imagenes');
  } else {
    this.loading = true;

    let datos = {id: this.editInfo.id_servicios , imagenes : this.imagenes};

    this._provedorService.enviarFotosEditServicio(datos).subscribe((response) => {
      console.log(response);
      if (response === true) {
        imagenes = true;
        this.status = 'success';
        this.statusText = 'El servicio se actualizo con exito';
        window.scroll(0, 0);
        this.loading = false;
      } else {
        this.status = 'error';
        this.statusText = 'Error al actualizar el servicio, por favor intentalo más tarde o revisa tu conexión';
        window.scroll(0, 0);
        this.loading = false;
      }

    }, (err) => {
      imagenes = false;
        this.status = 'error';
        this.statusText = 'Error al actualizar el servicio, por favor intentalo más tarde o revisa tu conexión';
        window.scroll(0, 0);
        this.loading = false;
    });

   }

   console.log(imagenes);

   if (this.imagenesBorrar.length >= 1) {
     console.log('hay fotos para borrar');

     for (let i = 0; i < this.imagenesBorrar.length; i++) {
      this.borrarFotosEdit(this.imagenesBorrar[i].id , this.imagenesBorrar[i].ruta);
     }
   }

   if (this.datosEdit.dirty) {

    this.loading = true;

    let token = this._userService.getToken();
    let formulario = { id: this.editInfo.id_servicios, nombre: this.datosEdit.value.nombre, precio: this.datosEdit.value.precio,
      direccion: this.datosEdit.value.direccion, descuento: this.datosEdit.value.descuento, duracion: this.datosEdit.value.duracion,
      id_mncp: this.mncpSelect, id_ctga: this.editInfo.id_cate , video: this.datosEdit.value.video, max_citas: this.maxCitas,
      descripcion: this.datosEdit.value.descripcion};

      console.log(formulario);

      this._provedorService.editInfoServicio(formulario, token).subscribe((response) => {
        console.log(response);
        if (response === true) {
          this.status = 'success';
          this.statusText = 'El servicio se actualizo con exito';
          window.scroll(0, 0);
          this.loading = false;
        }
      }, (err) => {
        this.status = 'error';
        this.statusText = 'Error al actualizar el servicio, por favor intentalo más tarde o revisa tu conexión';
        window.scroll(0, 0);
        this.loading = false;
      });
   }

 }

 borrarFotosEdit(id, ruta) {
   this.loading = true;

   this._provedorService.dltImagenServicio(id, ruta).subscribe((response) => {
      console.log(response);
      this.status = 'success';
      this.statusText = 'El servicio se actualizo con exito';
      window.scroll(0, 0);
      this.loading = false;
   }, (err) => {
     console.log(err);
      this.status = 'error';
      this.statusText = 'Error al actualizar el servicio, por favor intentalo más tarde o revisa tu conexión';
      window.scroll(0, 0);
      this.loading = false;
   });
 }

 cerrarAlerta() {
   this.status = null;
 }

 eliminarPub(id) {
  this.loading = true;
  let token = this._userService.getToken();
  this._provedorService.dltService(id, token).subscribe( (response) => {
    console.log(response);
    this.loading = false;
    if (response === false ) {
      this.status = 'error';
      this.statusText = 'No se puede eliminar el servicio, existen citas agendadas';
    } else {
      this.getPublications(this.identity.id_provedor);
      this.status = 'success';
      this.statusText = 'La publicación se ha eliminado exitosamente';
    }
  }, (err) => {
    this.loading = false;
    this.status = 'error';
    this.statusText = 'No se puede eliminar el servicio, por favor revisa tu conexión o intentalo más tarde.';
  });
 }

}
