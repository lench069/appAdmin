import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../servicios.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  public pedidos: number = 0;
  public productos: number = 0;
  public clientes: number = 0;
  public usuarios: number = 0;
  public userLogeado;

  constructor(
    public servicio: ServiciosService,
    public apermisos: AndroidPermissions,
    private storage: Storage
  ) { 
    
  }

  ionViewWillEnter() {
    this.servicio.Obtener_Totales()
      .subscribe((data: any) => {
        this.pedidos = data.info.pedidos;
        this.productos = data.info.productos;
        this.clientes = data.info.clientes;
        this.usuarios = data.info.usuarios;
      });
  }

  ngOnInit() {
    this.apermisos.requestPermissions([
      this.apermisos.PERMISSION.CAMERA,
      this.apermisos.PERMISSION.BIND_NOTIFICATION_LISTENER_SERVICE,
      this.apermisos.PERMISSION.ACCESS_NOTIFICATION_POLICY,
    ]).then((data: any) => {

    });
    this.servicio.Inicializar_Notificacion();
    
  }

}
