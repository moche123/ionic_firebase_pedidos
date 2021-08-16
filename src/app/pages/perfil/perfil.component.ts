import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Cliente } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {

  cliente: Cliente = {
    uid: '',
    nombre: '',
    dni: '',
    email: '',
    celular: '',
    foto: '',
    referencia: '',
    ubicacion: null
  }
  newFile: any;
  uid = ''; 

  subscriberUserInfo:Subscription;

  ingresarEnable = false;

  constructor(
    public menuController: MenuController,
    public firebaseauthService: FirebaseauthService,
    public firestoreService: FirestoreService,
    public firestorageService: FirestorageService


  ) { 
    this.firebaseauthService.stateAuth().subscribe( res => {
      console.log(res);
      if(res != null){
        this.uid = res.uid
        this.getUserInfo(this.uid)
      }else{
        this.initCliente()
      }
    } )
  }

  initCliente(){
    this.uid = '';
        this.cliente = {
          uid: '',
          nombre: '',
          dni: '',
          email: '',
          celular: '',
          foto: '',
          referencia: '',
          ubicacion: null
        }
    console.log(this.cliente)
  }

  async ngOnInit() {

    const uid = await this.firebaseauthService.getUid()
    console.log(uid);
  }

  openMenu() {
    this.menuController.toggle('principal')
  }

  async newImageUpload(event: any) {

    if (event.target.files && event.target.files[0]) {
      this.newFile = event.target.files[0]
      const reader = new FileReader();
      reader.onload = ((image) => {
        this.cliente.foto = image.target.result as string;

      });
      reader.readAsDataURL(event.target.files[0])
    }

  }

  async registrarse() {
    const credenciales = {
      email: this.cliente.email,
      password: this.cliente.celular
    };
    const res = await this.firebaseauthService.registrar(credenciales.email, credenciales.password).catch(err => {
      console.log('err => ', err);
    });
    const uid = await this.firebaseauthService.getUid()
    this.cliente.uid = uid;
    this.guardarUser();
    console.log(uid);
  }

  async guardarUser() {

    const path = 'Clientes';
    const name = this.cliente.nombre;

    if (this.newFile !== undefined) {

      const res = await this.firestorageService.uploadImage(this.newFile, path, name);
      this.cliente.foto = res;
    }



    this.firestoreService.createDoc(this.cliente, path, this.cliente.uid).then(res => {
      console.log('Guardado con exito')
    }).catch(err => {})
    
  }




  async salir() {
    // const uid = await this.firebaseauthService.getUid()
    // console.log(uid);   
    this.firebaseauthService.logout();
    this.subscriberUserInfo.unsubscribe();
  }

  getUserInfo( uid:string ){
    console.log('getUserInfo')
    const path = 'Clientes';
    this.subscriberUserInfo = this.firestoreService.getDoc<Cliente>( path,uid ).subscribe( res =>{
      this.cliente = res
    } )
  }

  ingresar(){
    const credenciales = {
      email: this.cliente.email,
      password: this.cliente.celular
    };
    this.firebaseauthService.login(credenciales.email,credenciales.password).then( res=>{
      console.log('ingreso con exito')
    } )
  }



}
