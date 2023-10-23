import { Component } from '@angular/core';
import { ToastController, NavController, AlertController, LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Params, Router } from '@angular/router';
import emailjs from 'emailjs-com';
//import{EmailComposer} from '@ionic-native/email-composer/ngx';
//import { EmailComposerOptions } from '@ionic-native/email-composer';
//import { IonicNativePlugin } from '@ionic-native/core';

@Component({
  selector: 'app-schedule-interview',
  templateUrl: './schedule-interview.page.html',
  styleUrls: ['./schedule-interview.page.scss'],
})
export class ScheduleInterviewPage {

  // Initialize properties with default values
  int_id:any; // Unique interview ID
  name:any;
  surname:any;
  email: any;
  date:any;
  status='Waiting';
  emailError:any;
  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 
  toast: any;
  fullName: any;
  data: any;
  tables$: any;
  oneDocData: any;


  counter: number = 1;

  

    
  constructor( private db: AngularFirestore,private router:Router,private toastController: ToastController,
    private alertController: AlertController,private loadingController: LoadingController,
     public navCtrl: NavController, private auth: AngularFireAuth,
     private route: ActivatedRoute
     ) {}

     ngOnInit() {

      this.route.queryParams.subscribe((params) => {
        if (params && params['email']) {
          this.email = params['email'];
          // Fetch data for the specified email
          this.getOneDocumentData();
        }
      });
      // Retrieve the data passed from the previous page
      //const data = this.navCtrl.get('queryParams');
      
      // Now you can use the 'data' object in this component as needed
      this.getOneDocumentData;
    }
    

    getOneDocumentData() {
      if (this.email) {
        this.db
          .collection('applicant-application', (ref) =>
            ref.where('email', '==', this.email)
          )
          .valueChanges()
          .subscribe((data: any[]) => {
            if (data && data.length > 0) {
              this.checkIfDocumentExist = true;
              const docData = data[0];
              this.oneDocData = docData;
              this.email=docData.email;
              this.name=docData.fullName;
              this.surname=docData.surname;
              console.log(this.email);

              const currentDate = new Date();
              const day = currentDate.getDate().toString().padStart(2, '0');
              const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
              const year = currentDate.getFullYear().toString();
              const formattedDate = `${year}${month}${day}`;
              this.int_id = `${formattedDate}${this.formatCounter(this.counter)}`;

              // Increment the counter for the next unique ID
              this.counter++;
              console.log(this.int_id);
            }
          });
      }
    }
    checkIfDocumentExist = false;

    private formatCounter(counter: number): string {
      return counter.toString().padStart(3, '0');
    }

    getAllDocuments() {
      this.db
        .collection('applicant-application')
        .valueChanges()
        .subscribe((data) => {
          this.tables$ = data;
        });
    }

    getPasedData() {
      this.route.queryParams.subscribe((params: Params) => {
        if (params && params['userData']) {
          // Use the correct query parameter name (userData) to extract the data
          const userData = params['userData'];
          console.log(userData);
  
          // Assuming email is a key in the userData object, you can extract it like this:
          this.email = userData.email;
          
          // Now call the getOneDocumentData method to fetch the specific document
          this.getOneDocumentData();
        }
      });
    }

    getPassedData() {
      this.route.queryParams.subscribe((params: Params) => {
        if (params && params['userData']) {
          // Assuming you passed 'userData' as the query parameter
          const userData = params['userData'];
          this.email = userData.email; // Extract the email from userData (adjust this according to your data structure)
          console.log(this.email);
          this.getOneDocumentData();
        }
      });
    }
 
  async submit() {
  
    if (!this.emailRegex.test(this.email)) {
      const toast = await this.toastController.create({
        message: "Please enter a valid email address.",
        duration: 2000,
        position: 'top'
      });
      return;
    }
    
      
    if (this.int_id.toString().length< 0) {
      const toast = await this.toastController.create({
        message: 'ID Invalid',
        duration: 2000,
        position: 'top',
        color: 'danger'
      });
      toast.present();
      return;
    }
    
    if (this.int_id.toString().length > 20) {
      const toast = await this.toastController.create({
        message: 'ID invalid',
        duration: 2000,
        position: 'top',
        color: 'danger'
      });
      toast.present();
      return;
    }


    if(!isNaN(this.int_id)){
    
    }else{
      const toast = await this.toastController.create({
        message: 'ID must be 13 digits only',
        duration: 2000,
        position: 'top',
        color: 'danger'
      });
      toast.present();
      return;
    }

    

     const loader = await this.loadingController.create({
      message: 'Scheduling',
      cssClass: 'custom-loader-class'
    });

    // const toast = await this.toastController.create({
    //   message: 'Schduled Successfully',
    //   duration: 2000,
    //   position: 'top',
    //   color: 'success'
    // });
    // toast.present();
    // return;
   
  
      const pattern =/^[a-zA-Z]*$/;
  
      // if (!pattern.test(this.name)) {
      //   const toast = await this.toastController.create({
      //     message: 'Name must be characters only',
      //     duration: 2000,
      //     position: 'top',
      //     color: 'danger'
      //   });
      //   toast.present();
      //   return;

      // }
  
    /*  if (!pattern.test(this.surname)) {
        const toast = await this.toastController.create({
          message: 'Surname must be characters only',
          duration: 2000,
          position: 'top',
          color: 'danger'
        });
        toast.present();
        return;

      } */
    
      
  
    await loader.present(); 

    
    try 
    {
      // Check if the ID already exists in the Firestore collection
      const idExistsSnapshot = await this.db.collection('Interviewees').ref.where('int_id', '==', this.int_id).get();
  
      if (!idExistsSnapshot.empty) {
        const toast = await this.toastController.create({
          message: 'ID already exists',
          duration: 2000,
          position: 'top',
          color: 'danger'
        });
        toast.present();
        return;
      }

      const collectionRef = this.db.collection('Interviewees').ref;

  // Check if the email already exists in the Firestore collection
      const emailExistsSnapshot = await collectionRef.where('email', '==', this.email).get();

      if (!emailExistsSnapshot.empty) {
        const toast = await this.toastController.create({
          message: 'Email already exists',
          duration: 2000,
          position: 'top',
          color: 'danger'
        });
        toast.present();
        loader.dismiss();
        return;
      }
      
      this.db
        .collection('Interviewees')
        .add({
                int_id:this.int_id,
                name:this.name,
                email: this.email,
                date:this.date,
                Status:this.status
        })
        .then((docRef) => {
          loader.dismiss();


        })
        .catch((error) => {
         // loader.dismiss();
          console.error('Error adding document: ', error);
          alert('failed : ' + error);
        });
  
      // Proceed with user creation and data addition
    //   const userCredential = await this.auth.createUserWithEmailAndPassword(this.email, this.int_id);
  
    //   if (userCredential) {
    //     await this.db.collection('Interviewees').add({
    //       int_id: this.int_id,
    //       name: this.name,
    //       surname: this.surname,
    //       email: this.email,
    //       date: this.date,
    //       Status: this.status
    //     });
  
    //     console.log('User and data added successfully');
    //   }
    } catch (error) {
      // Handle errors
      console.error('Error:', error);
      // Display appropriate error messages using toastController
    }
    // this.auth.createUserWithEmailAndPassword(this.email, this.int_id)
    //   .then( userCredential => {

      
    //     this.db
    //     .collection('Interviewees')
    //     .add({
    //             int_id:this.int_id,
    //             name:this.name,
    //             email: this.email,
    //             date:this.date,
    //             Status:this.status
    //     })
    //     .then((docRef) => {
    //       loader.dismiss();

    //     })
    //     .catch((error) => {
    //      // loader.dismiss();
    //       console.error('Error adding document: ', error);
    //       alert('failed : ' + error);
    //     });
    
       

    //     /////
    //     // this.router.navigateByUrl("/login");
       
    //     // ...
    //   })
    //   .catch(async( error:any) => {
    //     //loader.dismiss();
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
       


    //     if(errorMessage=='Firebase: The email address is badly formatted. (auth/invalid-email).'){
    //     const toast = await this.toastController.create({
    //       message: "The email address is badly formatted",
    //       duration: 2000,
    //       position: 'top',
    //       color:'danger'
    //     });
    //     toast.present();
    //     return;
        
    //   }else if(errorMessage=="Firebase: The email address is already in use by another account. (auth/email-already-in-use)."){
    //     const toast = await this.toastController.create({
    //       message: "The email address is already in use by another account",
    //       duration: 2000,
    //       position: 'top',
    //       color:'danger'
    //     });
    //     toast.present();
    //     return;
    // }
    //   });

      //sending an email
      const emailParams={
        name:this.name,
        surname:this.surname,
        Email: this.email,
        from_email:'thandekan736@gmail.com',
        subject:'Interview Invitation from MUTInnovation Lab',
        message:'You are invited for an interview on the',
        date:this.date
      };
  
      try{
         await emailjs.send('service_cc5n4da','template_srn36yh',
         emailParams,'7oDBuuKkIXSTVYQgn'
         );
         console.log('email successfully sent');
         alert('email successfully sent');
      }
    catch(error){
      console.error('error sending email', error);
      alert('error sending email');
    }

    }

    // const loader = await this.loadingController.create({
    //   message: 'Signing up',
    //   cssClass: 'custom-loader-class'
    // });
 
    // await loader.present();
    // this.auth.createUserWithEmailAndPassword(this.email, this.int_id)
    // .then(async (userCredential) => {
    //   if (userCredential.user) {
    //     await this.db.collection('Interviewees').add({
    //       int_id:this.int_id,
    //       name:this.name,
    //       surname:this.surname,
    //       email: this.email,
    //       date: new Date()
    //     });
    //     loader.dismiss();
    //     alert("Registered Successfully");
    //     this.navCtrl.navigateForward("/sign-in");
    //   } else {
    //     loader.dismiss();
    //     alert('User not found');
    //   }
    // })
    // .catch((error) => {
    //   loader.dismiss();
    //   const errorMessage = error.message;
    //   alert(errorMessage);
    // });
    
  }
      
function presentToast(message: any, string: any) {
  throw new Error('Function not implemented.');
}

  

function isValidInput(input: any, any: any) {
  throw new Error('Function not implemented.');
}
  // You can implement the checkScheduledInterviews() method here
 



