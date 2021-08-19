import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
})
export class CarritoComponent implements OnInit {

  constructor(
    public menuController: MenuController,
    public firestoreService: FirestoreService
  ) {
    // this.loadProductos()
  }

  ngOnInit() { }

  openMenu() {
    this.menuController.toggle('principal')
  }


}
