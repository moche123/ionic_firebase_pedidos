import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Producto } from 'src/app/models';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-set-productos',
  templateUrl: './set-productos.component.html',
  styleUrls: ['./set-productos.component.scss'],
})
export class SetProductosComponent implements OnInit {

  fotoPrevista = false;
  
  productos: Producto[] = [];
  enableNewProducto = false;
  newProducto: Producto;
  newImage = '';
  newFile = '';


  private path = 'Productos/'
  loading: any;

  constructor(
    public menuController: MenuController,
    public firestoreService: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
    public firestorageService: FirestorageService


  ) { }



  ngOnInit() {
    this.getProductos()
  }
  openMenu() {
    this.menuController.toggle('principal')
  }

  async guardarProducto() {
    this.presentLoading();
    
    const path = 'PathProductos';
    const name = this.newProducto.nombre;
    const res = await this.firestorageService.uploadImage( this.newFile,path,name );
    this.newProducto.foto = res;
    
    
    
    this.firestoreService.createDoc(this.newProducto, this.path, this.newProducto.id).then(res => {
      this.loading.dismiss();
      this.presentToast('Guardado con exito')
      this.fotoPrevista = false;
    }).catch(err => {
      this.presentToast('no se pudo guardar')
    })
    this.enableNewProducto = false;
  }

  getProductos() {
    this.firestoreService.getCollection<Producto>(this.path).subscribe(res => {
      this.productos = res
    })
  }

  async deleteProducto(producto: Producto) {


    const alert = await this.alertController.create({
      cssClass: 'normal',
      header: 'Advertencia',
      message: '¿Seguro que desea <strong>eliminar</strong>? este producto',
      buttons: [
        {
          text: 'cancelar',
          role: 'cancel',
          cssClass: 'normal',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');

            this.firestoreService.deleteDoc(this.path, producto.id).then(res => {
              this.presentToast('Eliminado con exito')
              this.alertController.dismiss();
            }).catch(err => {
              this.presentToast('no se pudo guardar')
            })
          }
        }
      ]
    });

    await alert.present();

  }

  nuevo() {
    this.enableNewProducto = true;
    this.newProducto = {
      nombre: '',
      precioNormal: null,
      precioReducido: null,
      foto: '',
      id: this.firestoreService.getId(),
      fecha: new Date()
    };
    // this.presentLoading();

  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'normal',
      message: 'Guardando...'
    });
    await this.loading.present();

  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      // cssClass: 'normal',
      duration: 2000
    });
    toast.present();
  }

  async newImageUpload(event: any) {

    if (event.target.files && event.target.files[0]) {
      this.newFile = event.target.files[0]
      const reader = new FileReader();
      reader.onload = ((image) => {
        this.newImage = image.target.result as string;
        this.fotoPrevista = true;
      });
      reader.readAsDataURL(event.target.files[0])
    }



  }


}
