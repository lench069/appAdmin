import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../servicios.service';
import { AlertController, LoadingController, IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit {

  public pedidos: any[] = [];
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
    this.Cargar_Pedidos();
  }

  async Cargar_Pedidos() {
    let l = await this.loading.create();
    l.present();
    this.servicio.Pedido_Listado(this.texto)
      .subscribe((data: any) => {
        this.pedidos = data.info.items;
        this.total = data.info.total;
        console.log(this.pedidos);
        l.dismiss();
      }, (error: any) => {
        l.dismiss();
      });
  }

  Editar(item: any, ionItemSliding: IonItemSliding) {
    ionItemSliding.close();
    this.servicio.irA('/pedido/' + item.id);
  }

  async Borrar(item: any, ionItemSliding: IonItemSliding) {
    ionItemSliding.close();
    let alert = await this.alert.create({
      header: 'Confirmación',
      message: '¿Está seguro que desea eliminar el pedido [' + item.id + ']?',
      buttons: [
        {
          text: 'Si',
          handler: async () => {
            let l = await this.loading.create({
              message: 'Borrando...'
            });
            l.present();
            this.servicio.Pedido_Borrar(item.id)
              .subscribe((data: any) => {
                this.Cargar_Pedidos();
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
