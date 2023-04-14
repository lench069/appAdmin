import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ServiciosService } from '../servicios.service';

@Component({
  selector: 'app-olvide-pass',
  templateUrl: './olvide-pass.page.html',
  styleUrls: ['./olvide-pass.page.scss'],
})
export class OlvidePassPage implements OnInit {
  public pass:string = "";

  constructor(private router: Router,
  	private storage: Storage,
    public toastCtrl: ToastController,
    private servicio:ServiciosService,
    public loading: LoadingController) { }

  ngOnInit() {
  }

 async olvidePass(){
    let l = await this.loading.create(); //se crea el loading
    l.present(); //se muestra el loading
    this.servicio.olvideContrasenia({
      correo: this.pass
    }).subscribe((data:any)=>{
      console.log(data);
      if(data.flag == 'true'){
       // this.storage.set('session_storage', data.info.item);
       this.servicio.Mensaje('Se envio una clave temporal a su correo.', 'success');
        this.servicio.irA('/login');
        l.dismiss();//quita el loading una vez cargue todo
      }else{
        this.servicio.Mensaje(data.mensaje, 'danger');
          l.dismiss();//quita el loading una vez cargue todo
      }
    },(error:any)=>{
   
      this.servicio.Mensaje('No se pudo realizar la peticion, compruebe su conexion a internet.','danger');
      l.dismiss();//quita el loading una vez cargue todo

    });
  }

}
