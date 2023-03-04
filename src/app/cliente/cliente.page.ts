import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../servicios.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit {

  public id: number = 0;
  public identificacion: string = '';
  public nombre: string = '';
  public telefono: string = '';
  public correo: string = '';
  public direccion: string = '';

  constructor(
    public servicio: ServiciosService,
    public route: ActivatedRoute,
    public loading: LoadingController
  ) {
    this.id = this.route.snapshot.params.clienteId ? this.route.snapshot.params.clienteId : 0;
  }

  async ionViewWillEnter() {
    if (this.id > 0) {
      let l = await this.loading.create();
      l.present();
      this.servicio.Cliente_Consulta_id(this.id)
        .subscribe((data: any) => {
          l.dismiss();
          if (data.info.item.id > 0) {
            this.identificacion = data.info.item.identificacion;
            this.nombre = data.info.item.nombre;
            this.telefono = data.info.item.telefono;
            this.correo = data.info.item.correo;
            this.direccion = data.info.item.direccion;
          } else {
            this.servicio.Mensaje('El cliente que intenta consultar no existe.', 'danger');
            this.servicio.irA('/clientes');
          }
        }, _ => {
          l.dismiss();
          this.servicio.Mensaje('No se pudo realizar la petición.', 'danger');
          this.servicio.irA('/clientes');
        });
    }
  }

  ngOnInit() {
  }

  async Guardar() {
    if (this.identificacion == '') {
      this.servicio.Mensaje('Debe ingresar la identificación.', 'warning');
    } else if (this.nombre == '') {
      this.servicio.Mensaje('Debe ingresar el nombre.', 'warning');
    } else if (this.telefono == '') {
      this.servicio.Mensaje('Debe ingresar el telefono.', 'warning');
    } else if (this.correo == '') {
      this.servicio.Mensaje('Debe ingresar el correo.', 'warning');
    } else if (this.direccion == '') {
      this.servicio.Mensaje('Debe ingresar la dirección.', 'warning');
    }  else {
      let l = await this.loading.create();
      l.present();
      this.servicio.Cliente_Guardar({
        id: this.id,
        identificacion: this.identificacion,
        nombre: this.nombre,
        telefono: this.telefono,
        correo: this.correo,
        direccion: this.direccion
      }).subscribe((data: any) => {
        l.dismiss();
        this.servicio.Mensaje(data.mensaje, data.info.id == 0 ? 'danger' : 'success');
        if (data.info.id > 0) {
          this.servicio.irA('/clientes');
        }
      }, _ => {
        l.dismiss();
        this.servicio.Mensaje('No se pudo realizar la petición.', 'danger');
      });
    }
  }
}
