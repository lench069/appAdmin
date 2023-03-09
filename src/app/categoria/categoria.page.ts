import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Camera } from '@ionic-native/camera/ngx';
import { AlertController, LoadingController } from '@ionic/angular';
import { ServiciosService } from '../servicios.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.page.html',
  styleUrls: ['./categoria.page.scss'],
})
export class CategoriaPage implements OnInit {

  public id: number = 0;
  public nombre: string = '';
  public descripcion: string = '';
  public imagen: any = null;

  constructor(
    public servicio: ServiciosService,
    public route: ActivatedRoute,
    public loading: LoadingController,
    public camara: Camera
  ) {
    this.id = this.route.snapshot.params.categoriaId ? this.route.snapshot.params.categoriaId : 0;
  }

  async ionViewWillEnter() {
    if (this.id > 0) {
      let l = await this.loading.create();
      l.present();
      this.servicio.Categoria_Consulta(this.id)
        .subscribe((data: any) => {
          l.dismiss();
          if (data.info.item.id > 0) {
            this.nombre = data.info.item.titulo;
            this.descripcion = data.info.item.descripcion;
            this.imagen = data.info.item.imagen;
          } else {
            this.servicio.Mensaje('La categoria que intenta consultar no existe.', 'danger');
            this.servicio.irA('/categorias');
          }
        }, _ => {
          l.dismiss();
          this.servicio.Mensaje('No se pudo realizar la petición.', 'danger');
          this.servicio.irA('/categorias');
        });
    }
  }

  ngOnInit() {
  }

  async Guardar() {
    if (this.nombre == '') {
      this.servicio.Mensaje('Debe ingresar el nombre.', 'warning');
    }else if (this.descripcion == '') {
        this.servicio.Mensaje('Debe ingresar una descripcion.', 'warning');
    } else {
      let l = await this.loading.create();
      l.present();
      this.servicio.Categoria_Guardar({
        id: this.id,
        nombre: this.nombre,
        descripcion: this.descripcion,
        imagen: this.imagen
      }).subscribe((data: any) => {
        l.dismiss();
        this.servicio.Mensaje(data.mensaje, data.info.id == 0 ? 'danger' : 'success');
        if (data.info.id > 0) {
          this.servicio.irA('/categorias');
        }
      }, _ => {
        l.dismiss();
        this.servicio.Mensaje('No se pudo realizar la petición.', 'danger');
      });
    }
  }

  Capturar_Foto() {

    this.camara.getPicture({
      quality: 100,
      targetHeight: 800,
      targetWidth: 800,
      correctOrientation:true,
      destinationType: this.camara.DestinationType.DATA_URL,
      encodingType: this.camara.EncodingType.JPEG,
      mediaType: this.camara.MediaType.PICTURE
    }).then((imageData) => {
      this.imagen = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      this.servicio.Mensaje('No capturó ninguna imagen.', 'danger');
    });
 
  }
 
  gallery_Foto() {
    this.camara.getPicture({
      sourceType: this.camara.PictureSourceType.SAVEDPHOTOALBUM,
      destinationType: this.camara.DestinationType.DATA_URL,
      encodingType: this.camara.EncodingType.JPEG
    }).then((res) => {
      console.log(res);
      this.imagen = 'data:image/jpeg;base64,' + res;
    }).catch(e => {
      console.log(e);
    })
  }

}
