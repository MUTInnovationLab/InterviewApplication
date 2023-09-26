
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ToastController ,LoadingController} from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-hrlogin',
  templateUrl: './hrlogin.page.html',
  styleUrls: ['./hrlogin.page.scss'],
})
export class HrloginPage implements OnInit {

  email='';
  password='';

  constructor(private loadingController: LoadingController, public navCtrl: NavController,
    private router: Router,private toastController: ToastController, private auth: AngularFireAuth) {}

  ngOnInit() {
  }

  async login(){
    if (!this.email) {
      this.presentToast('Email is required.','danger');
      return;
    }
    if (!this.password) {
      this.presentToast('Password is required.','danger');
      return;
    }
 
    const loader = await this.loadingController.create({
      message: 'Signing in',
      cssClass: 'custom-loader-class'
    });
    await loader.present();

    this.auth.signInWithEmailAndPassword(this.email, this.password)
    .then(userCredential => {
      loader.dismiss();
     
      this.checkEmailVerification();

    })
    .catch((error:any) => {
      loader.dismiss();
      const errorCode = error.code;
      const errorMessage = error.message;
      this.presentToast(errorMessage,'danger');

      if(errorMessage=='Firebase: The email address is badly formatted. (auth/invalid-email).'){
        this.presentToast("The email address is badly formatted",'danger');
      }
      else if(errorMessage=="Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found)."){
        this.presentToast("There is no user record corresponding to this identifier",'danger');
      }

    });
  }


  async checkEmailVerification() {
    const user = await this.auth.currentUser;
    if (user) {
      await user.reload();
      if (user.emailVerified) {
        // Email is verified
        this.navCtrl.navigateForward('/dashboard');
      } else {
        // Email is not verified
        this.presentToast('Email is not verified. Please check your inbox and verify your email.',"danger");
      }
    } else {
      this.presentToast('No user found.',"danger");
    }
  }

  async presentToast(message: string,color:any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top', 
      color: color
    });
    toast.present();
  }
}




