import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ServiciosService } from '../servicios.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  public id: number = 0;
  cedula: string = '';
  nombre: string = '';
  telefono: string = '';
  correo: string = '';
  direccion: string = '';
  uuid: string = '';

  constructor( private router: Router,
  	private storage: Storage,
    public toastCtrl: ToastController,
    private servicio:ServiciosService,
    public loading: LoadingController) { 
      
    }

  async ngOnInit() {
    this.uuid = await this.storage.get('uuid');
  }

  async prosesLogin(){
    let l = await this.loading.create(); //se crea el loading
    l.present(); //se muestra el loading
    if(this.cedula == '')
    {
      this.servicio.Mensaje('Ingrese su cedula.', 'warning');
      l.dismiss();//quita el loading una vez cargue todo
    }else if(this.nombre == '')
    {
      this.servicio.Mensaje('Ingrese su nombre.', 'warning');
      l.dismiss();//quita el loading una vez cargue todo
    }else if(this.telefono == '')
    {
      this.servicio.Mensaje('Ingrese su telefono.', 'warning');
      l.dismiss();//quita el loading una vez cargue todo
    }else if(this.correo == '')
    {
      this.servicio.Mensaje('Ingrese su correo.', 'warning');
      l.dismiss();//quita el loading una vez cargue todo
    }else if(this.direccion == '')
    {
      this.servicio.Mensaje('Ingrese su direccion.', 'warning');
      l.dismiss();//quita el loading una vez cargue todo
    }else
    {
      this.servicio.Cliente_Guardar({
        id: this.id,
        cedula: this.cedula,
        nombre: this.nombre,
        telefono: this.telefono,
        correo: this.correo,
        direccion: this.direccion,
        uuid: this.uuid,
      }).subscribe((data:any)=>{
        console.log(data);
        l.dismiss();
        this.servicio.Mensaje(data.mensaje, data.info.id == 0 ? 'danger' : 'success');
        if (data.info.id > 0) {
          this.storage.set('cliente', {
            correo: this.correo,
            direccion: this.direccion,
            identificacion: this.cedula,
            nombre: this.nombre,
            telefono: this.telefono});
          this.servicio.irA('/inicio-cliente');
        }
      },(error:any)=>{
          this.servicio.Mensaje('No se pudo realizar la peticion, compruebe su conexion a internet.','danger');
          l.dismiss();//quita el loading una vez cargue todo
      });

    }

  }

}
