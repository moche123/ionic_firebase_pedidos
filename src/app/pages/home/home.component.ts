import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Producto } from 'src/app/models';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  private path = 'Productos/'

  productos: Producto[] = [];
  constructor(
    public menuController: MenuController,
    public firestoreService: FirestoreService
  ) {
    this.loadProductos()
  }

  ngOnInit() { }

  openMenu() {
    this.menuController.toggle('principal')
  }

  loadProductos() {
    this.firestoreService.getCollection<Producto>(this.path).subscribe(res => {
      this.productos = res
    })
  }

}
