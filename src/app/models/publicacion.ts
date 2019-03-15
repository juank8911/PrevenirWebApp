export class Publicacion {
    constructor(public id_provedor: string, public token: string, public nombre: string, public precio: number,
                public direccion: string, public descuento: number, public duracion: number, public id_mncp: string,
                public id_ctga: string, public video: string, public max_citas: number, public descripcion: string,
                public medico_id: string) {}
}
