import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastController, AlertController } from '@ionic/angular';
import { Push, PushObject } from '@ionic-native/push/ngx';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  private URL_API: string = 'http://192.168.100.94/appBackEnd/';
  //private URL_API: string = 'http://riobytes.com/pedidosApp-back/';

  constructor(
    private router: Router,
    private http: HttpClient,
    private alert: AlertController,
    private push: Push,
    private toast: ToastController
  ) { }


  irA(url: string) {
    this.router.navigateByUrl(url);
  }

  //***********************Login******************************************/
  Login(data:any) {
    return this.http.post(
      this.URL_API + 'login-usuario', 
      this.objectToFormData({
        usuario: data.usuario,
        clave: data.clave,
      }) 
      );
  }

  Obtener_Totales() {
    return this.http.post(this.URL_API + 'obtener-totales', {});
  }

  /* Inicio: Productos */
  Producto_Listado(_texto: string = '') {
    return this.http.post(this.URL_API + 'listado-productos', this.objectToFormData({
      texto: _texto
    }));
  }

  Producto_Borrar(_id: number) {
    return this.http.post(this.URL_API + 'eliminar-producto', this.objectToFormData({
      producto_id: _id
    }));
  }

  Producto_Consulta(_id: number) {
    return this.http.get(this.URL_API + 'consultar-producto/' + _id);
  }

  Buscar_Productos_Categoria(_id: number) {
    return this.http.get(this.URL_API + 'consultar-producto-categoria/' + _id);
  }

  Producto_Guardar(data: any) {
    return this.http.post(this.URL_API + (data.id == 0 ? 'crear-producto' : 'actualizar-producto/' + data.id), this.objectToFormData({
      id: data.id,
      codigo: data.codigo,
      nombre: data.nombre,
      descripcion: data.descripcion,
      stock: data.stock,
      precio: data.precio,
      activo: data.activo,
      imagen: data.imagen,
      id_categoria: data.id_categoria
    }));
  }
  /* Fin: Productos */

  /* Inicio: Usuarios */
  Usuario_Listado(_texto: string = '') {
    return this.http.post(this.URL_API + 'listado-usuarios', this.objectToFormData({
      texto: _texto
    }));
  }

  Usuario_Borrar(_id: number) {
    return this.http.post(this.URL_API + 'eliminar-usuario', this.objectToFormData({
      usuario_id: _id
    }));
  }

  Usuario_Consulta(_id: number) {
    return this.http.get(this.URL_API + 'consultar-usuario/' + _id);
  }

  Usuario_Guardar(data: any) {
    return this.http.post(this.URL_API + (data.id == 0 ? 'crear-usuario' : 'actualizar-usuario/' + data.id), this.objectToFormData({
      id: data.id,
      usuario: data.usuario,
      nombre: data.nombre,
      telefono: data.telefono,
      correo: data.correo,
      clave: data.clave,
      activo: data.activo
    }));
  }
  /* Fin: Usuarios */

  /* Inicio: Usuarios */
  Cliente_Listado(_texto: string = '') {
    return this.http.post(this.URL_API + 'listado-clientes', this.objectToFormData({
      texto: _texto
    }));
  }

  Cliente_Borrar(_id: number) {
    return this.http.post(this.URL_API + 'eliminar-cliente', this.objectToFormData({
      cliente_id: _id
    }));
  }

  Cliente_Consulta(_id: string) {
    return this.http.get(this.URL_API + 'consultar-cliente/' + _id);
  }

  Cliente_Consulta_id(_id: number) {
    return this.http.get(this.URL_API + 'cliente-consulta-id/' + _id);
  }

  Cliente_Guardar(data: any) {
    console.log(data);
    return this.http.post(this.URL_API + (data.id == 0 ? 'crear-cliente' : 'actualizar-cliente/' + data.id), this.objectToFormData({
      id: data.id,
      identificacion: data.cedula,
      nombre: data.nombre,
      telefono: data.telefono,
      correo: data.correo,
      direccion: data.direccion,
      uuid: data.uuid
    }));
  }
  /* Fin: Usuarios */

  /* Inicio: Pedidos */
  Pedido_Listado(_texto: string = '') {
    return this.http.post(this.URL_API + 'listado-pedidos', this.objectToFormData({
      texto: _texto
    }));
  }

  report(data: any) {
    return this.http.post(this.URL_API + 'report', this.objectToFormData({
      fecha_ini : data.fecha_ini,
      fecha_fin : data.fecha_fin
    }));
  }

  Pedido_Listado_cliente (idcliente: number) {
    return this.http.get(this.URL_API + 'historial/' + idcliente);
  }

  Pedido_Borrar(_id: number) {
    return this.http.post(this.URL_API + 'eliminar-pedido', this.objectToFormData({
      pedido_id: _id
    }));
  }

  Pedido_Consulta(_id: number) {
    return this.http.get(this.URL_API + 'consultar-pedido/' + _id);
  }

  Pedido_Guardar(data: any) {
    console.log(data);
    return this.http.post(this.URL_API + (data.id == 0 ? 'crear-pedido' : 'actualizar-pedido/' + data.id), this.objectToFormData({
      id: data.id,
      cliente_id: data.cliente_id,
      usuario_id: data.usuario_id,
      fecha: data.fecha,
      estado: data.estado == 0 ? '0' : data.estado,
      subtotal: data.subtotal,
      iva: data.iva,
      total: data.total,
      mesa: data.mesa,
    }));
  }

  Pedido_Guardar_Producto(data: any) {
    return this.http.post(this.URL_API + 'pedido/agregar-producto/' + data.pedido_id, this.objectToFormData({
      id: data.id,
      pedido_id: data.pedido_id,
      producto_id: data.producto_id,
      cantidad: data.cantidad,
      precio: data.precio
    }));
  }

  Pedido_Borrar_Producto(data: any) {
    return this.http.post(this.URL_API + 'pedido/borrar-producto/' + data.pedido_id, this.objectToFormData({
      item_id: data.item_id,
      pedido_id: data.pedido_id
    }));
  }
  /* Fin: Pedidos */

  Inicializar_Notificacion() {
    this.push.hasPermission()
      .then((res: any) => {

        if (res.isEnabled) {
          this.push.createChannel({
            id: "canalpropio",
            description: "InventarioApp",
            importance: 3,
            badge: false
          }).then(() => console.log('Channel created'));

          const pushObject: PushObject = this.push.init({
            android: {},
            ios: {
              alert: 'true',
              badge: true,
              sound: 'false'
            },
            windows: {},
            browser: {
              pushServiceURL: 'http://push.api.phonegap.com/v1/push'
            }
          });

          pushObject.on('notification').subscribe(async (notification: any) => {
            let alert = await this.alert.create({
              header: notification.title,
              message: notification.message,
              buttons: [
                {
                  text: 'Cerrar'
                }
              ]
            });
            alert.present();
            console.log('Notificación: ', notification);
          });

          pushObject.on('registration').subscribe((registration: any) => {
            console.log('Dispositivo: ', registration);
          });

          pushObject.on('error').subscribe(error => {
            console.error('Error with Push plugin', error)
          });
        } else {
          this.Mensaje('La aplicación no tiene permisos para recibir notificaciones.');
        }

      });
  }

  async Mensaje(texto: string, tipo: string = 'success') {
    let t = await this.toast.create({
      message: texto,
      color: tipo,
      duration: 3000
    });
    t.present();
  }


  objectToFormData(obj: any, form?: any, namespace?: any) {
    let fd: any = form || new FormData();
    let formKey: any;
    for (let property in obj) {
      if (obj.hasOwnProperty(property) && obj[property]) {
        if (namespace) {
          formKey = namespace + '[' + property + ']';
        } else {
          formKey = property;
        }
        if (obj[property] instanceof Date) {
          fd.append(formKey, obj[property].toISOString());
        }
        if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
          this.objectToFormData(obj[property], fd, formKey);
        } else {
          fd.append(formKey, obj[property]);
        }

      }
    }
    return fd;
  };

  Categorias_Listado() {
    return this.http.post(this.URL_API + 'listado-categoria', this.objectToFormData({
    }));
  }
  
}
