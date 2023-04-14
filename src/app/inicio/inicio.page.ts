import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../servicios.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Storage } from '@ionic/storage-angular';
import { Route } from '@angular/router';

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

  public pages = [
    {
        name : 'Clientes',
        img : 'assets/imgs/clientes.png',
        color: '#48ddcf',
        route : 'clientes'
    },
    {
      name : 'Usuarios',
      img : 'assets/imgs/user.png',
      color: '#f34845',
      route : 'usuarios'
    },
    {
      name : 'Categorias',
      img : 'assets/imgs/categorias.png',
      color: '#ff7c31',
      route : 'categorias'
  },
    {
        name : 'Productos',
        img : 'assets/imgs/pedidos.png',
        color: '#46d2ff',
        route : 'productos'
    },
    {
        name : 'Pedidos',
        img : 'assets/imgs/carrito.png',
        color: '#facc03',
        route : 'pedidos'
    },
    {
        name : 'Reportes',
        img : 'assets/imgs/reporte.png',
        color: '#41d07a',
        route : 'reportes'
    },
    {
        name : 'Salir',
        img : 'assets/imgs/salir.png',
        color: '#5b69c2',
        route : 'salir'
    }
]

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

  goToPage(val) {
    if(val == 'clientes') {
        this.servicio.irA('/clientes');
    }
    if(val == 'usuarios') {
      this.servicio.irA('/usuarios');
    }
    if(val == 'productos') {
        this.servicio.irA('/productos');
    }
    if(val == 'pedidos') {
      this.servicio.irA('/pedidos');
    }
    if(val == 'reportes') {
      this.servicio.irA('/reports');
    }
    if(val == 'salir') {
      this.servicio.irA('/login');
    }
    if(val == 'categorias') {
      this.servicio.irA('/categorias');
    }
}


 
}



