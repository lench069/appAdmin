import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ServiciosService } from '../servicios.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string = '';
  password: string = '';
  public type:string='password';
  public nameIcon:string='eye';

  constructor(
    private router: Router,
  	private storage: Storage,
    public toastCtrl: ToastController,
    private servicio:ServiciosService,
    public loading: LoadingController
  ) { 
    this.storage.create();
    }

  ngOnInit() {
  }

  async prosesLogin(){
    let l = await this.loading.create(); //se crea el loading
    l.present(); //se muestra el loading
    if(this.username == '')
    {
      this.servicio.Mensaje('Ingrese su usuario.', 'warning');
      l.dismiss();//quita el loading una vez cargue todo
    }else if(this.password == '')
    {
      this.servicio.Mensaje('Ingrese su contraseña.', 'warning');
      l.dismiss();//quita el loading una vez cargue todo
    }else
    {
      this.servicio.Login({
        usuario: this.username,
        clave: this.password
      }).subscribe((data:any)=>{
        console.log(data);
        if(data.mensaje == 'true'){
          this.storage.set('session_storage', data.info.item);
          l.dismiss();//quita el loading una vez cargue todo
          this.router.navigate(['/inicio']);
          this.servicio.Mensaje('Login Succesfully.', 'success');
          this.username = "";
          this.password = "";
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
  showPass()
  {
    if(this.type == 'password')
    {
      this.type = 'text';
      this.nameIcon = "eye-off-outline";
    }else{
      this.type = 'password';
      this.nameIcon = "eye";
    }
    return this.type;
  }

  onForgot(){
    this.servicio.irA('/olvide-pass');
  }
}
