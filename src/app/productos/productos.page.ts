import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../servicios.service';
import { LoadingController, IonItemSliding, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {

  public productos: any[] = [];
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
    this.Cargar_Productos();
  }

  async Cargar_Productos() {
    let l = await this.loading.create();
    l.present();
    this.servicio.Producto_Listado(this.texto)
      .subscribe((data: any) => {
        this.productos = data.info.items;
        this.total = data.info.total;
        l.dismiss();
      }, (error: any) => {
        l.dismiss();
      });
  }

  Editar(item: any, ionItemSliding: IonItemSliding) {
    ionItemSliding.close();
    this.servicio.irA('/producto/' + item.id);
  }

  async Borrar(item: any, ionItemSliding: IonItemSliding) {
    ionItemSliding.close();
    let alert = await this.alert.create({
      header: 'Confirmación',
      message: '¿Está seguro que desea eliminar el producto [' + item.nombre + ']?',
      buttons: [
        {
          text: 'Si',
          handler: async () => {
            let l = await this.loading.create({
              message: 'Borrando...'
            });
            l.present();
            this.servicio.Producto_Borrar(item.id)
              .subscribe((data: any) => {
                this.Cargar_Productos();
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
