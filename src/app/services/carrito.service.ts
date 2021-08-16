import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente, Pedido, Producto,ProductoPedido } from '../models';
import { FirebaseauthService } from './firebaseauth.service';
import { FirestoreService } from './firestore.service';



@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private pedido: Pedido;

  path = 'carrito/';
  uid = '';
  cliente:Cliente;

  constructor(
    public firebaseauthService: FirebaseauthService,
    public firestoreService: FirestoreService,
    public router: Router
  ) {
    this.firebaseauthService.stateAuth().subscribe(res => {
      console.log(res);
      if (res != null) {
        this.uid = res.uid;
        this.loadCliente()
       
      }
    })
  }

  loadCarrito() {
    const path = 'Clientes/' + this.uid + '/' + this.path;
    this.firestoreService.getDoc<Pedido>(path, this.uid).subscribe(res => {
      console.log(res);
      if (res) {
        this.pedido = res;
      } else {
        this.initCarrito();
      }
    })
  }
  initCarrito() {
    console.log('inicializando carrito')
    this.pedido = {
      id: this.uid,
      cliente: this.cliente,
      productos: [],
      precioTotal: null,
      estado: 'enviado',
      fecha: new Date(),
      valoracion: null
    }
  }

  loadCliente(){
    console.log('getUserInfo')
    const path = 'Clientes';
     this.firestoreService.getDoc<Cliente>( path,this.uid ).subscribe( res =>{
      this.cliente = res
      this.loadCarrito()
    } )
  }
  
  getCarrito() {
    return this.pedido;
  }
  
  addProducto(producto: Producto) {
    if(this.uid.length>0){
      const item = this.pedido.productos.find( productoPedido => {
        return( productoPedido.producto.id == producto.id );
      })
      if( item!=undefined ){
        item.cantidad++;
      }else{
        const add:ProductoPedido = {
          cantidad:1,
          producto
        }
        this.pedido.productos.push(add)
      }
    }else{
      this.router.navigate(['/perfil'])
    }

    console.log('en add pedido=>',this.pedido)
    const path = 'Clientes/' + this.uid + '/' + this.path;

    this.firestoreService.createDoc( this.pedido, path, this.pedido.id).then( _ => {
      console.log('Añadido con exito')
    } )
  }
  
  removeProducto(producto: Producto) {
  
  }
  
  realizarPedido() {
  
  }
  
  clearCarrito() {
  
  }

}



