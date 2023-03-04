import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ServiciosService } from '../servicios.service';
import * as moment from 'moment';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  public pedidos : any;
  public subTotal: number = 0;
  public iva: number = 0;
  public Total: number = 0;
  public flag: boolean = false;
  public id: number = 0;
  public cliente_id: number = 0;
  public usuario_id: number = 0;
  public fecha: any = moment(new Date()).format("YYYY-MM-DD h:mm:ss");
  public estado: number = 0;
  public cliente: any = {};

  constructor(public servicio: ServiciosService,
    public loading: LoadingController,
    public alert: AlertController,
    private storage: Storage) { 
      
    }

  ngOnInit() {
    

  }
  async ionViewWillEnter() //se ejecuta a penas se abra la vista
  {
    this.storage.create();
    let pedidos = await this.storage.get('pedidos');
    this.cliente = await this.storage.get('cliente');
    if(pedidos != null){
      this.pedidos = pedidos;
    }else{
      this.pedidos = [];
    }
   
    this.calcularTotal();
  }

  add(pedido, i){
    if(pedido.cantidad < 10){   
      pedido.cantidad++;
      this.pedidos[i] = pedido;
      this.storage.set('pedidos', this.pedidos);
      this.calcularTotal();
    }
    
  }
  remove(pedido, i){
    if(pedido.cantidad > 1){
      pedido.cantidad--;
      this.pedidos[i] = pedido;
      this.storage.set('pedidos', this.pedidos);
      this.calcularTotal();
    }
    
  }

  deleteItem(pedido,i){
    this.pedidos.splice(i-1, 1);
    this.storage.set('pedidos', this.pedidos);
    this.calcularTotal();
    if(this.pedidos.length == 0){
    this.flag = false;
    }
  }
  async pedir()
  {

    const alert = await this.alert.create({
      header: 'Ingrese el numero de mesa',
      buttons: [{
        text: 'No',
        cssClass: 'alert-button-cancel',
        handler: () => {console.log('CANCEL') }
      },
      {
        text: 'Yes',
        cssClass: 'alert-button-confirm',
        handler: async(data)  => {
              console.log(this.subTotal);
              let l = await this.loading.create();
              l.present();
              this.servicio.Pedido_Guardar({
                id: this.id,
                cliente_id: this.cliente.id,
                usuario_id: 1,
                fecha: this.fecha,
                estado: 0,
                subtotal: this.subTotal,
                iva: this.iva,
                total: this.Total,
                mesa: data[0]
              }).subscribe((data: any) => {
                l.dismiss();
                this.pedidos.forEach(element => {
                  this.guardarDetalle(data.info.id, element);
                });
                this.storage.remove('pedidos');
                this.servicio.irA('/inicio-cliente')
                
              }, _ => {
                l.dismiss();
                this.servicio.Mensaje('No se pudo realizar la petición.', 'danger');
              });
        }
      }],
      inputs: [
        {
          id: 'mesa', 
          type: 'number',
          placeholder: '# Mesa',
          min: 1,
          max: 10,
        },       
      ],
    });

    await alert.present();



   /* console.log(this.subTotal);
    let l = await this.loading.create();
    l.present();
    this.servicio.Pedido_Guardar({
      id: this.id,
      cliente_id: this.cliente.id,
      usuario_id: 1,
      fecha: this.fecha,
      estado: 0,
      subtotal: this.subTotal,
      iva: this.iva,
      total: this.Total
    }).subscribe((data: any) => {
      l.dismiss();
      this.pedidos.forEach(element => {
        this.guardarDetalle(data.info.id, element);
      });
      this.storage.remove('pedidos');
      this.servicio.irA('/inicio-cliente')
      
    }, _ => {
      l.dismiss();
      this.servicio.Mensaje('No se pudo realizar la petición.', 'danger');
    });*/
  }

  calcularTotal(){
    if(this.pedidos.length > 0){
      this.flag = true;
      console.log(this.pedidos);
      this.subTotal = 0;
      this.pedidos.forEach(element => {
            this.subTotal = this.subTotal + (parseFloat(element.precio) * element.cantidad);
        });
        this.iva = this.subTotal * 0.12;
        this.Total = this.subTotal + this.iva;
    }
  }

   guardarDetalle(pedidoId, pedido){
      if (pedidoId > 0) {
          //Guarda el detalle del pedido
        this.servicio.Pedido_Guardar_Producto({
          pedido_id: pedidoId ,
          producto_id: pedido.id,
          cantidad: pedido.cantidad,
          precio: pedido.precio
        }).subscribe((data: any) => {
          
        });
      }
  }

}
