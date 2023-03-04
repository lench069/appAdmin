import { Component, OnInit } from '@angular/core';
import { AlertController, IonItemSliding, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ServiciosService } from '../servicios.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {

  public pedidos: any[] = [];
  public cliente: any = null;

  constructor(
    public servicio: ServiciosService,
    public loading: LoadingController,
    public alert: AlertController,
    private storage: Storage
  ) { 
    this.storage.create();
  }

  ngOnInit() {

  }

   ionViewWillEnter() {
    this.Cargar_Pedidos();
  }

  async Cargar_Pedidos() {
    this.cliente = await this.storage.get('cliente');
    let l = await this.loading.create();
    l.present();
    this.servicio.Pedido_Listado_cliente(this.cliente.id)
      .subscribe((data: any) => {
        this.pedidos = data.info.items;
        console.log(this.pedidos);
        l.dismiss();
      }, (error: any) => {
        l.dismiss();
      });
  }
}
