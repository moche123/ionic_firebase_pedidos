import { Component,OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Pedido } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';



@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent implements OnInit {
  nuevosSuscriber: Subscription;
  culminadosSuscriber: Subscription;
  pedidos: Pedido[]=[];
  constructor(public menuController: MenuController,
              public firestoreService: FirestoreService,
              public firebaseauthService : FirebaseauthService,
              

    ) { }

  ngOnInit() {
  }
  
  openMenu() {
    this.menuController.toggle('principal')
  }
  
  changeSegment(ev: any){
    // console.log('changeSegment()',ev.detail.value);
    const opc =ev.detail.value;
    if(opc==='Culminados'){
      // this.getPedidosCulminados();
    }
    if(opc==='Nuevos'){
      this.getPedidosNuevos();
    }
  }
  async getPedidosNuevos(){
    console.log('getPedidosNuevos()');
    const path ='pedidos'
    this.nuevosSuscriber= this.firestoreService.getCollectionAll<Pedido>(path,'estado','==','enviado').subscribe(res=>{
      if(res.length){
        console.log('getPedidosNuevos() =>res',res);
        this.pedidos=res;
      }

    });
  }
  async getPedidosCulminados(){
    console.log('getPedidosCulminados()');
    const uid = await this.firebaseauthService.getUid()
    const path ='Clientes/'+uid+'/pedidos/'
    this.culminadosSuscriber= this.firestoreService.getCollectionQuery<Pedido>(path,'estado','==','entregado').subscribe(res=>{
      if(res.length){
        console.log('getPedidosCulminados() =>res',res);
        this.pedidos=res;
      }

    });
  }
}

