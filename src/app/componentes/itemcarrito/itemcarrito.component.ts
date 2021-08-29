import { Component, Input, OnInit } from '@angular/core';
import { Producto, ProductoPedido } from 'src/app/models';
import { CarritoService } from 'src/app/services/carrito.service';

@Component({
  selector: 'app-itemcarrito',
  templateUrl: './itemcarrito.component.html',
  styleUrls: ['./itemcarrito.component.scss'],
})
export class ItemcarritoComponent implements OnInit {
  @Input() productoPedido: ProductoPedido;
  @Input() botones=true;

  constructor(public carritoService: CarritoService) { }

  ngOnInit() { 
   
    
  }
  addCarrito(){
    console.log(this.productoPedido );
    this.carritoService.addProducto( this.productoPedido.producto);
  } 
  removeCarrito(){
    this.carritoService.removeProducto( this.productoPedido.producto);
  }
}
