import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Pedido } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-mispedidos',
  templateUrl: './mispedidos.component.html',
  styleUrls: ['./mispedidos.component.scss'],
})
export class MispedidosComponent implements OnInit,OnDestroy {
  nuevosSuscriber: Subscription;
  culminadosSuscriber: Subscription;
  pedidos: Pedido[]=[];
  constructor(public menuController: MenuController,
              public firestoreService: FirestoreService,
              public firebaseauthService : FirebaseauthService,
              

    ) { }

  ngOnInit() {
    this.getPedidosNuevos();
  }
  ngOnDestroy(){
    if(this.nuevosSuscriber){
      this.nuevosSuscriber.unsubscribe();
    }
    if(this.culminadosSuscriber){
      this.culminadosSuscriber.unsubscribe();
    }
  }
  openMenu() {
    this.menuController.toggle('principal')
  }
  
  changeSegment(ev: any){
    // console.log('changeSegment()',ev.detail.value);
    const opc =ev.detail.value;
    if(opc==='Culminados'){
      this.getPedidosCulminados();
    }
    if(opc==='Nuevos'){
      this.getPedidosNuevos();
    }
  }
  async getPedidosNuevos(){
    console.log('getPedidosNuevos()');
    const uid = await this.firebaseauthService.getUid();
    const path ='Clientes/'+uid+'/pedidos/'
    this.nuevosSuscriber= this.firestoreService.getCollectionQuery<Pedido>(path,'estado','==','enviado').subscribe(res=>{
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
