import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { where } from 'firebase/firestore';
import { Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-score-capture',
  templateUrl: './score-capture.page.html',
  styleUrls: ['./score-capture.page.scss'],
})
export class ScoreCapturePage implements OnInit {
  groupedInterviewees: Map<string, any[]> = new Map();
  selectedOption: any; // Variable to store the selected option

  introduction: number = 0;
  teamwork: number = 0;
  overallImpression: number = 0;
  leadershipSkills: number = 0;
  adaptability: number = 0;
  communicationSkills: number = 0;
  jobSpecificSkills: number = 0;
  problemSolving: number = 0;
  total: number = 0;
  todayDateString: string;
  inProgressInterviewee: any = null; // Store the person with "In Progress" status

  constructor(private firestore: AngularFirestore) {
    this.todayDateString = new Date().toDateString();
  }

  ngOnInit() {
    this.fetchData();
  }

  sortIntervieweesByDate() {
    // Sort the grouped interviewees by date (keys)
    this.groupedInterviewees = new Map([...this.groupedInterviewees.entries()].sort());
  }

  fetchData() {
    this.firestore.collection('Interviewees').valueChanges().subscribe((data: any[]) => {
      this.groupedInterviewees = data.reduce((result, interviewee) => {
        const itemDate = new Date(interviewee.date);
        const dateKey = itemDate.toDateString();

        if (dateKey === this.todayDateString) {
          interviewee.date = dateKey;

          if (!result.has(dateKey)) {
            result.set(dateKey, []);
          }
          result.get(dateKey).push(interviewee);

          // Check for "In Progress" status
          if (interviewee.Status === 'In Progress') {
            this.inProgressInterviewee = interviewee;
          }
        }

        return result;
      }, new Map<string, any[]>());

      // Sort the grouped interviewees by date
      this.sortIntervieweesByDate();
    });
  }

  // Function to filter only today's data
  getTodayData(): any[] {
    return this.groupedInterviewees.get(this.todayDateString) || [];
  }

  start() {
    if (this.inProgressInterviewee) {
      const { name, surname, email } = this.inProgressInterviewee;

      // Display a message box with the details of the person with "In Progress" status
      const confirmation = window.confirm(`Start interview with ${name} ${surname} (${email})?`);
      if (confirmation) {
        // Proceed with saving the data to the database
        // this.submitForm();

        console.log('The interview has started');
      }
    } else {
      alert('No person with "In Progress" status found.');
    }
  }

  calculateTotal() {
    this.total =
      this.limitToTen(this.introduction) +
      this.limitToTen(this.teamwork) +
      this.limitToTen(this.overallImpression) +
      this.limitToTen(this.leadershipSkills) +
      this.limitToTen(this.adaptability) +
      this.limitToTen(this.communicationSkills) +
      this.limitToTen(this.jobSpecificSkills) +
      this.limitToTen(this.problemSolving);
  }

  limitToTen(value: number): number {
    return value > 10 ? 10 : value;
  }

  checkMaxValue(event: any) {
    const value = parseInt(event.target.value, 10);
    if (isNaN(value)) return;
    if (value > 10) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  submitForm() {
    this.calculateTotal();

    alert(`Introduction: ${this.introduction}\nTeamwork: ${this.teamwork}\n...`); // Include all the relevant details

    // Now you can proceed with adding the data to Firestore if needed
    const formData = {
      introduction: this.introduction,
      teamwork: this.teamwork,
      overallImpression: this.overallImpression,
      leadershipSkills: this.leadershipSkills,
      adaptability: this.adaptability,
      communicationSkills: this.communicationSkills,
      jobSpecificSkills: this.jobSpecificSkills,
      problemSolving: this.problemSolving,
      total: this.total,
      // Include other details as needed
    };

    this.firestore
      .collection('feedback')
      .add(formData)
      .then(() => {
        // Data added successfully
        console.log('Form data added to Firestore!');
      })
      .catch((error) => {
        console.error('Error adding form data to Firestore:', error);
      });
  }

  Clear() {
    this.introduction = 0;
    this.teamwork = 0;
    this.overallImpression = 0;
    this.leadershipSkills = 0;
    this.adaptability = 0;
    this.communicationSkills = 0;
    this.jobSpecificSkills = 0;
    this.problemSolving = 0;
    this.total = 0;
  }
}

























// import { Component, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { where } from 'firebase/firestore';
// import {Input, Output, EventEmitter } from '@angular/core';


// @Component({
//   selector: 'app-score-capture',
//   templateUrl: './score-capture.page.html',
//   styleUrls: ['./score-capture.page.scss'],
// })
// export class ScoreCapturePage implements OnInit {
//   groupedInterviewees: Map<string, any[]> = new Map();
//   selectedOption: any;// Variable to store the selected option

//   introduction: number = 0;
//   teamwork: number = 0;
//   overallImpression: number = 0;
//   leadershipSkills: number = 0;
//   adaptability: number = 0;
//   communicationSkills: number = 0;
//   jobSpecificSkills: number = 0;
//   problemSolving: number = 0;
//   total: number = 0;
//  todayDateString: string;

//   constructor(private firestore: AngularFirestore) {
//     this.todayDateString = new Date().toDateString();
//   }

//   ngOnInit() {
//     this.fetchData();
//   }
//   sortIntervieweesByDate() {
//     // Sort the grouped interviewees by date (keys)
//     this.groupedInterviewees = new Map([...this.groupedInterviewees.entries()].sort());
//   }
 

//   fetchData() {
//     this.firestore.collection('Interviewees').valueChanges().subscribe((data: any[]) => {
//       this.groupedInterviewees = data.reduce((result, interviewee) => {
//         const itemDate = new Date(interviewee.date);
//         const dateKey = itemDate.toDateString();
  
//         if (dateKey === this.todayDateString) {
//           interviewee.date = itemDate;
          
//           if (!result.has(dateKey)) {
//             result.set(dateKey, []);
//           }
//           result.get(dateKey).push(interviewee);
//         }
  
//         return result;
//       }, new Map<string, any[]>());
  
//       // Sort the grouped interviewees by date
//       this.sortIntervieweesByDate();
//     });
//   }
  
//   // Function to filter only today's data
//   getTodayData(): any[] {
//     return this.groupedInterviewees.get(this.todayDateString) || [];
//   }
  
// start(){
  
// }
//   calculateTotal() {
//     this.total =
//       this.limitToTen(this.introduction) +
//       this.limitToTen(this.teamwork) +
//       this.limitToTen(this.overallImpression) +
//       this.limitToTen(this.leadershipSkills) +
//       this.limitToTen(this.adaptability) +
//       this.limitToTen(this.communicationSkills) +
//       this.limitToTen(this.jobSpecificSkills) +
//       this.limitToTen(this.problemSolving);
//   }

 

//   limitToTen(value: number): number {
//     return value > 10 ? 10 : value;
//   }

//   checkMaxValue(event: any) {
//     const value = parseInt(event.target.value, 10);
//     if (isNaN(value)) return; 
//     if (value > 10) {
//       event.preventDefault(); 
//       event.stopPropagation(); 
//     }
//   }

//   submitForm() {
//     this.calculateTotal();

//     alert('Introduction:'+ this.introduction + '\n'
//     + 'Teamwork:'+ this.teamwork + '\n'
//      + 'Overall Impression:'+ this.overallImpression + '\n' 
//      + 'Leadership Skills:'+ this.leadershipSkills + '\n'
//      + 'Adaptability:'+ this.adaptability + '\n'
//      + 'Communication Skills:'+ this.communicationSkills + '\n'
//      + 'Job Specific Skills:'+ this.jobSpecificSkills + '\n'
//      + 'Problem-Solving:'+ this.problemSolving + '\n'
//      + 'Total:'+ this.total);

//     // Now you can proceed with adding the data to Firestore if needed
//     const formData = {
//       introduction: this.introduction,
//       teamwork: this.teamwork,
//       overallImpression: this.overallImpression,
//       leadershipSkills: this.leadershipSkills,
//       adaptability: this.adaptability,
//       communicationSkills: this.communicationSkills,
//       jobSpecificSkills: this.jobSpecificSkills,
//       problemSolving: this.problemSolving,
//       total: this.total,
//     };

//     this.firestore
//       .collection('feedback')
//       .add(formData)
//       .then(() => {
//         // Data added successfully
//         console.log('Form data added to Firestore!');
//       })
//       .catch((error) => {
//         console.error('Error adding form data to Firestore:', error);
//       });
//   }

//   Clear() {
//     this.introduction = 0;
//     this.teamwork = 0;
//     this.overallImpression = 0;
//     this.leadershipSkills = 0;
//     this.adaptability = 0;
//     this.communicationSkills = 0;
//     this.jobSpecificSkills = 0;
//     this.problemSolving = 0;
//     this.total = 0;
//   }


  
// }
