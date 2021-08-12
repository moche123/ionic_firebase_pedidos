import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Producto } from 'src/app/models';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-set-productos',
  templateUrl: './set-productos.component.html',
  styleUrls: ['./set-productos.component.scss'],
})
export class SetProductosComponent implements OnInit {

  productos: Producto[] = [];
  enableNewProducto = false;

  constructor( public menuController: MenuController,public firestoreService: FirestoreService ) { }
  newProducto: Producto ;

  private path = 'Productos/'

  ngOnInit() {
    this.getProductos()
  }
  openMenu(){
    this.menuController.toggle('principal')
  }

  guardarProducto(){
    this.firestoreService.createDoc(this.newProducto, this.path, this.newProducto.id);
    this.enableNewProducto = false;
  }

  getProductos(){
    this.firestoreService.getCollection<Producto>(this.path).subscribe( res =>{
      this.productos = res
    } )
  }

  deleteProducto( producto:Producto ){
    this.firestoreService.deleteDoc( this.path,producto.id )
  }

  nuevo(){
    this.enableNewProducto = true;
    this.newProducto = {
      nombre: '',
      precioNormal:null,
      precioReducido:null,
      foto:'',
      id:this.firestoreService.getId(),
      fecha:new Date()
    };
  }

}
