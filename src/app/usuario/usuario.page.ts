import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../servicios.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {

  public id: number = 0;
  public usuario: string = '';
  public nombre: string = '';
  public clave: string = '';
  public correo: string = '';
  public telefono: string = '';
  public activo: boolean = true;

  constructor(
    public servicio: ServiciosService,
    public route: ActivatedRoute,
    public loading: LoadingController
  ) {
    this.id = this.route.snapshot.params.usuarioId ? this.route.snapshot.params.usuarioId : 0;
  }

  async ionViewWillEnter() {
    if(this.id > 0) {
      let l = await this.loading.create();
      l.present();
      this.servicio.Usuario_Consulta(this.id)
        .subscribe((data: any) => {
          l.dismiss();
          if (data.info.item.id > 0) {
            this.nombre = data.info.item.nombre;
            this.usuario = data.info.item.usuario;
            this.clave = data.info.item.clave;
            this.correo = data.info.item.correo;
            this.telefono = data.info.item.telefono;
            this.activo = data.info.item.activo == 1 ? true : false;
          } else {
            this.servicio.Mensaje('El usuario que intenta consultar no existe.', 'danger');
            this.servicio.irA('/usuarios');
          }
        }, _ => {
          l.dismiss();
          this.servicio.Mensaje('No se pudo realizar la petición.', 'danger');
          this.servicio.irA('/usuarios');
        });
    }
  }

  ngOnInit() {
  }

  async Guardar() {
    if (this.usuario == '') {
      this.servicio.Mensaje('Debe ingresar el usuario.', 'warning');
    } else if (this.clave == '') {
      this.servicio.Mensaje('Debe ingresar la clave.', 'warning');
    } else if (this.nombre == '') {
      this.servicio.Mensaje('Debe ingresar el nombre.', 'warning');
    } else if (this.telefono == '') {
      this.servicio.Mensaje('Debe ingresar el teléfono.', 'warning');
    } else if (this.correo == '') {
      this.servicio.Mensaje('Debe ingresar el correo.', 'warning');
    } else {
      let l = await this.loading.create();
      l.present();
      this.servicio.Usuario_Guardar({
        id: this.id,
        usuario: this.usuario,
        nombre: this.nombre,
        correo: this.correo,
        telefono: this.telefono,
        clave: this.clave,
        activo: this.activo ? 1 : 0
      }).subscribe((data: any) => {
        l.dismiss();
        this.servicio.Mensaje(data.mensaje, data.info.id == 0 ? 'danger' : 'success');
        if (data.info.id > 0) {
          this.servicio.irA('/usuarios');
        }
      }, _ => {
        l.dismiss();
        this.servicio.Mensaje('No se pudo realizar la petición.', 'danger');
      });
    }
  }
}
