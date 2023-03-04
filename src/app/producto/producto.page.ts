import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../servicios.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Camera } from '@ionic-native/camera/ngx';


@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
})
export class ProductoPage implements OnInit {

  public id: number = 0;
  public codigo: string = '';
  public nombre: string = '';
  public descripcion: string = '';
  public stock: number = 0;
  public precio: number = 0;
  public activo: boolean = true;
  public imagen: any = null;
  public id_provincia:number = 0;
  public categorias: any[] = [];
  public id_categoria:number = 0;

  constructor(
    public servicio: ServiciosService,
    public route: ActivatedRoute,
    public loading: LoadingController,
    public camara: Camera
  ) {
    this.id = this.route.snapshot.params.productoId ? this.route.snapshot.params.productoId : 0;
  }

  async ionViewWillEnter() {
    this.Cargar_Categorias();
    if (this.id > 0) {
      let l = await this.loading.create();
      l.present();
      this.servicio.Producto_Consulta(this.id)
        .subscribe((data: any) => {
          l.dismiss();
          if (data.info.item.id > 0) {
            this.codigo = data.info.item.codigo;
            this.nombre = data.info.item.nombre;
            this.stock = data.info.item.stock;
            this.precio = data.info.item.precio;
          } else {
            this.servicio.Mensaje('El producto que intenta consultar no existe.', 'danger');
            this.servicio.irA('/productos');
          }
        }, _ => {
          l.dismiss();
          this.servicio.Mensaje('No se pudo realizar la petición.', 'danger');
          this.servicio.irA('/productos');
        });
    }
  }

  ngOnInit() {
  }

  async Cargar_Categorias() {
    let l = await this.loading.create();
    l.present();
    this.servicio.Categorias_Listado()
      .subscribe((data: any) => {
        this.categorias = data.info.items;
        l.dismiss();
      }, (error: any) => {
        l.dismiss();
      });
  }

  async Guardar() {
    if (this.codigo == '') {
      this.servicio.Mensaje('Debe ingresar el código.', 'warning');
    }else if(this.id_categoria == 0){
      this.servicio.Mensaje('Debe seleccionar una categoria.', 'warning');
    } else if (this.nombre == '') {
      this.servicio.Mensaje('Debe ingresar el nombre.', 'warning');
     } else if (this.descripcion == '') {
        this.servicio.Mensaje('Debe ingresar una descripcion.', 'warning');
    } else if (this.stock == 0) {
      this.servicio.Mensaje('Debe ingresar el stock.', 'warning');
    } else if (this.precio == 0) {
      this.servicio.Mensaje('Debe ingresar el precio.', 'warning');
    } else {
      let l = await this.loading.create();
      l.present();
      this.servicio.Producto_Guardar({
        id: this.id,
        codigo: this.codigo,
        nombre: this.nombre,
        descripcion: this.descripcion,
        id_categoria: this.id_categoria,
        stock: this.stock,
        precio: this.precio,
        activo: this.activo ? 1 : 0,
        imagen: this.imagen
      }).subscribe((data: any) => {
        l.dismiss();
        this.servicio.Mensaje(data.mensaje, data.info.id == 0 ? 'danger' : 'success');
        if (data.info.id > 0) {
          this.servicio.irA('/productos');
        }
      }, _ => {
        l.dismiss();
        this.servicio.Mensaje('No se pudo realizar la petición.', 'danger');
      });
    }
  }

  Capturar_Foto() {

    this.camara.getPicture({
      quality: 60,
      targetHeight: 800,
      targetWidth: 800,
      destinationType: this.camara.DestinationType.DATA_URL,
      encodingType: this.camara.EncodingType.JPEG,
      mediaType: this.camara.MediaType.PICTURE
    }).then((imageData) => {
      this.imagen = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      this.servicio.Mensaje('No capturó ninguna imagen.', 'danger');
    });
  }
}
