import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../servicios.service';
import { IonItemSliding, AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {

  public usuarios: any[] = [];
  public total: number = 0;
  public texto: string = '';

  constructor(
    public servicio: ServiciosService,
    public loading: LoadingController,
    public alert: AlertController
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.Cargar_Usuarios();
  }

  async Cargar_Usuarios() {
    let l = await this.loading.create();
    l.present();
    this.servicio.Usuario_Listado(this.texto)
      .subscribe((data: any) => {
        this.usuarios = data.info.items;
        this.total = data.info.total;
        l.dismiss();
      }, (error: any) => {
        l.dismiss();
      });
  }

  Editar(item: any, ionItemSliding: IonItemSliding) {
    ionItemSliding.close();
    this.servicio.irA('/usuario/' + item.id);
  }

  async Borrar(item: any, ionItemSliding: IonItemSliding) {
    ionItemSliding.close();
    let alert = await this.alert.create({
      header: 'Confirmación',
      message: '¿Está seguro que desea eliminar el usuario [' + item.nombre + ']?',
      buttons: [
        {
          text: 'Si',
          handler: async () => {
            let l = await this.loading.create({
              message: 'Borrando...'
            });
            l.present();
            this.servicio.Usuario_Borrar(item.id)
              .subscribe((data: any) => {
                this.Cargar_Usuarios();
                l.dismiss();
              }, (error: any) => {
                l.dismiss();
              });
          }
        },
        {
          text: 'No',
          handler: () => { }
        }
      ]
    });
    alert.present();
  }
}
