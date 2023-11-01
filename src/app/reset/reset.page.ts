import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth} from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';



@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss'],
})
export class ResetPage implements OnInit {
  email:any;
  emailError:any;
  constructor(private auth:AngularFireAuth,private navController: NavController,private alertController: AlertController,private toastController: ToastController,private navCtrl: NavController) { }
  

  ngOnInit() {
  }

  goToHomePage(): void {
    this.navController.navigateBack('/home');
  }

  reset(){
   
   
    this.auth.sendPasswordResetEmail(this.email)
    .then(userCredential => {
  
      window.alert("Email sent with link to reset your password");
     
      this.navController.navigateForward("/sign-in");


      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      window.alert("please enter a valid email");

      // ..
    });
  }

  goToView() {
    this.navController.navigateForward('/view');
  }

  goToPage() {
    this.navController.navigateForward("/applicant-login");
  }

  async presentConfirmationAlert() {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'Are you sure you want to SIGN OUT?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
         cssClass: 'my-custom-alert',
          handler: () => {
            console.log('Confirmation canceled');
          }
        }, {
          text: 'Confirm',
          handler: () => {
           
            
            this.auth.signOut().then(() => {
              this. navCtrl.navigateForward("/applicant-login");
              this.presentToast();
        
        
            }).catch(() => {
            
            });



          }
        }
      ]
    });
    await alert.present();
  }


  async presentToast() {
    const toast = await this.toastController.create({
      message: 'SIGNED OUT!',
      duration: 1500,
      position: 'top',
    
    });

    await toast.present();
  }

  }

