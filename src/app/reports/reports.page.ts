import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ServiciosService } from '../servicios.service';
import * as moment from 'moment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  public pedidos: any[] = [];
  public segment: String= 'default';
  public fecha_ini: any = null;
  public fecha_fin: any = null;
  public totalT: number = 0;

  constructor(public servicio: ServiciosService,
    private storage: Storage,
    public loading: LoadingController) { }

  ngOnInit() {
    this.selectDefault();
  }

  async Pedido_Listado_report(fecha_ini, 
  fecha_fin) {
    let ini = fecha_ini;
    let fin = fecha_fin;
    this.totalT = 0;
    let l = await this.loading.create();
    l.present();
    this.servicio.report({
      fecha_ini: ini,
      fecha_fin: fin
    }).subscribe((data: any) => {
      console.log(data);
      if(data != null){
        this.pedidos = data;
        this.pedidos.forEach(element => {
          console.log(element.total);
          this.totalT = this.totalT + parseFloat(element.total);
        });
        l.dismiss();
      }else{
        this.pedidos = [];
        this.servicio.Mensaje('No hay pedidos para mostrar', 'danger');
        l.dismiss();
      }
        
      }, (error: any) => {
        l.dismiss();
      });
  }
  selectDefault(){
    this.fecha_ini = moment(new Date()).format("YYYY-MM-DD"+' 00:00:00');
    this.fecha_fin = moment(new Date()).format("YYYY-MM-DD"+' 23:59:00');
    this.Pedido_Listado_report(this.fecha_ini,this.fecha_fin);
  }
  selectFechas(){
    console.log('prueba');
    this.fecha_ini = null;
    this.fecha_fin = null;
    this.segment = 'rango';
  }

  async rangoFechas(){

    console.log(this.fecha_ini);
    let l = await this.loading.create(); //se crea el loading
    l.present(); //se muestra el loading
    if(this.fecha_ini == null)
    {
      this.servicio.Mensaje('Ingrese una fecha inicial', 'warning');
      l.dismiss();//quita el loading una vez cargue todo
    }else if (this.fecha_fin == null)
    {
      this.servicio.Mensaje('Ingrese una fecha final', 'warning');
      l.dismiss();//quita el loading una vez cargue todo
    }else
    {
      
      this.fecha_ini = moment(this.fecha_ini).format("YYYY-MM-DD"+' 00:00:00');
      this.fecha_fin = moment(this.fecha_fin).format("YYYY-MM-DD"+' 23:59:00');
      this.Pedido_Listado_report(this.fecha_ini,this.fecha_fin);
      l.dismiss();
    }

  }
  
}
