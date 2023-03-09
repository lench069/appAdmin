import { Component, OnInit } from '@angular/core';
import { AlertController, IonItemSliding, LoadingController } from '@ionic/angular';
import { ServiciosService } from '../servicios.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
})
export class CategoriasPage implements OnInit {

  public categorias: any[] = [];
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
    this.Cargar_Categorias();
  }

  async Cargar_Categorias() {
    let l = await this.loading.create();
    l.present();
    this.servicio.Categoria_Listado(this.texto)
      .subscribe((data: any) => {
        this.categorias = data.info.items;
        this.total = data.info.total;
        l.dismiss();
      }, (error: any) => {
        l.dismiss();
      });
  }

  Editar(item: any, ionItemSliding: IonItemSliding) {
    ionItemSliding.close();
    this.servicio.irA('/categoria/' + item.id);
  }

  async Borrar(item: any, ionItemSliding: IonItemSliding) {
    ionItemSliding.close();
    let alert = await this.alert.create({
      header: 'Confirmación',
      message: '¿Está seguro que desea eliminar la categoria [' + item.nombre + ']?',
      buttons: [
        {
          text: 'Si',
          handler: async () => {
            let l = await this.loading.create({
              message: 'Borrando...'
            });
            l.present();
            this.servicio.Categoria_Borrar(item.id)
              .subscribe((data: any) => {
                this.Cargar_Categorias();
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
