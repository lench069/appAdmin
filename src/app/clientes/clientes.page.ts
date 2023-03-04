import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../servicios.service';
import { IonItemSliding, LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {

  public clientes: any[] = [];
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
    this.Cargar_Clientes();
  }

  async Cargar_Clientes() {
    let l = await this.loading.create();
    l.present();
    this.servicio.Cliente_Listado(this.texto)
      .subscribe((data: any) => {
        this.clientes = data.info.items;
        this.total = data.info.total;
        l.dismiss();
      }, (error: any) => {
        l.dismiss();
      });
  }

  Editar(item: any, ionItemSliding: IonItemSliding) {
    ionItemSliding.close();
    this.servicio.irA('/cliente/' + item.id);
  }

  async Borrar(item: any, ionItemSliding: IonItemSliding) {
    ionItemSliding.close();
    let alert = await this.alert.create({
      header: 'Confirmación',
      message: '¿Está seguro que desea eliminar el cliente [' + item.nombre + ']?',
      buttons: [
        {
          text: 'Si',
          handler: async () => {
            let l = await this.loading.create({
              message: 'Borrando...'
            });
            l.present();
            this.servicio.Cliente_Borrar(item.id)
              .subscribe((data: any) => {
                this.Cargar_Clientes();
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
