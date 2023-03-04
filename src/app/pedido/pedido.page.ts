import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../servicios.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, IonItemSliding, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss'],
})
export class PedidoPage implements OnInit {

  public id: number = 0;
  public cliente_id: number = 0;
  public usuario_id: number = 0;
  public fecha: any = null;
  public estado: number = 0;
  public subtotal: number = 0;
  public iva: number = 0;
  public total: number = 0;
  public mesa: number = 0;

  public clientes: any[] = [];
  public usuarios: any[] = [];
  public productos: any[] = [];
  public productos_listado: any[] = [];
  public _producto: any = null;
  public pedido: any = null;


  public estados: any[] = [
    {
      id: 0,
      texto: 'Creado'
    },
    {
      id: 1,
      texto: 'Procesado'
    },
    {
      id: 2,
      texto: 'Finalizado'
    }
  ];

  constructor(
    public servicio: ServiciosService,
    public route: ActivatedRoute,
    public loading: LoadingController,
    public alert: AlertController
  ) {
    this.id = this.route.snapshot.params.pedidoId ? this.route.snapshot.params.pedidoId : 0;
  }

  async ionViewWillEnter() {
    this.servicio.Cliente_Listado()
      .subscribe((data: any) => {
        this.clientes = data.info.items;
      });

    this.servicio.Usuario_Listado()
      .subscribe((data: any) => {
        this.usuarios = data.info.items;
      });

    this.servicio.Producto_Listado()
      .subscribe((data: any) => {
        this.productos = data.info.items;
      });

    if (this.id > 0) {
      this.Cargar_Informacion();
    }
  }

  ngOnInit() {
  }

  async Guardar() {
    if (this.cliente_id == 0) {
      this.servicio.Mensaje('Debe seleccionar el cliente.', 'warning');
    } else if (this.usuario_id == 0) {
      this.servicio.Mensaje('Debe seleccionar el vendedor.', 'warning');
    } else if (this.fecha == null) {
      this.servicio.Mensaje('Debe seleccioanr la fecha.', 'warning');
    } else {
      console.log(this.fecha);
      let l = await this.loading.create();
      l.present();
      this.servicio.Pedido_Guardar({
        id: this.id,
        cliente_id: this.cliente_id,
        usuario_id: this.usuario_id,
        fecha: this.fecha,
        estado: this.estado,
        subtotal: this.subtotal,
        iva: this.iva,
        total: this.total,
      }).subscribe((data: any) => {
        l.dismiss();
        this.servicio.Mensaje(data.mensaje, data.info.id == 0 ? 'danger' : 'success');
        if (data.info.id > 0) {
          this.servicio.irA('/pedidos');
        }
      }, _ => {
        l.dismiss();
        this.servicio.Mensaje('No se pudo realizar la petición.', 'danger');
      });
    }
  }

  async Cargar_Informacion() {
    let l = await this.loading.create();
    l.present();
    this.servicio.Pedido_Consulta(this.id)
      .subscribe((data: any) => {
        console.log(data.info.item.mesa);
        l.dismiss();
        if (data.info.item.id > 0) {
          this.cliente_id = data.info.item.cliente_id;
          this.usuario_id = data.info.item.usuario_id;
          this.estado = data.info.item.estado;
          this.fecha = data.info.item.fecha;
          this.productos_listado = data.info.item.items;
          this.subtotal = data.info.item.subtotal;
          this.iva = data.info.item.iva;
          this.total = data.info.item.total;
          this.pedido = data.info.item;
          this.mesa = data.info.item.mesa;
        } else {
          this.servicio.Mensaje('El pedido que intenta consultar no existe.', 'danger');
          this.servicio.irA('/pedidos');
        }
      }, _ => {
        l.dismiss();
        this.servicio.Mensaje('No se pudo realizar la petición.', 'danger');
        this.servicio.irA('/pedidos');
      });
  }

  async Prod_Seleccionado() {
    let l = await this.loading.create();
    l.present();
    this.servicio.Pedido_Guardar_Producto({
      pedido_id: this.id,
      producto_id: this._producto.id,
      cantidad: 1,
      precio: this._producto.precio
    }).subscribe((data: any) => {
      l.dismiss();
      this.Cargar_Informacion();
    }, _ => {
      l.dismiss();
    });
  }

  async Mod_Producto(producto: any) {
    let l = await this.loading.create();
    l.present();
    this.servicio.Pedido_Guardar_Producto({
      pedido_id: this.id,
      producto_id: producto.producto_id,
      cantidad: producto.cantidad,
      precio: producto.precio
    }).subscribe((data: any) => {
      l.dismiss();

       //this.Cargar_Informacion();
        this.calcularTotal();

    }, _ => {
      l.dismiss();
    });
  }

  Calcular_Total(): number {
    let total: number = 0;
    for (let prod of this.productos_listado) {
      total += prod.cantidad * prod.precio;
    }
    return total;
  }

  calcularTotal(){
      this.subtotal = 0;
      console.log(this.pedido);
      this.pedido.items.forEach(element => {
            this.subtotal = this.subtotal + (parseFloat(element.precio) * element.cantidad);
        });
        console.log(this.subtotal);
        this.iva = this.subtotal * 0.12;
        this.total = this.subtotal + this.iva;
    
  }

  async Borrar_Producto(producto: any, ionItemSliding: IonItemSliding) {
    ionItemSliding.close();

    let alert = await this.alert.create({
      header: 'Confirmación',
      message: '¿Está seguro que desea eliminar?',
      buttons: [
        {
          text: 'Si',
          handler: async () => {
            let l = await this.loading.create();
            l.present();
            this.servicio.Pedido_Borrar_Producto({
              pedido_id: this.id,
              item_id: producto.id
            }).subscribe((data: any) => {
              l.dismiss();
              this.Cargar_Informacion();
            }, _ => {
              l.dismiss();
            });
          }
        },
        {
          text: 'No',
          handler: () => {

          }
        }
      ]
    });
    alert.present();
  }
}
