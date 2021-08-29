import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FirebaseauthService } from './services/firebaseauth.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  admin = false;
  constructor(
    private platform: Platform,  
    private firebaseauthService: FirebaseauthService
) {
  this.initializeApp();
  }
    
  initializeApp(){
    this.getUid();
  }
  getUid(){
    this.firebaseauthService.stateAuth().subscribe(res =>{
      if(res !== null){
        if(res.uid=='2ritqy0lI6TUAhChHgF3O1pvgKk2'){
          this.admin=true;
        }else{
          this.admin=false;
        }  
      }else{
        this.admin=false;
      }
    });
  }
}
