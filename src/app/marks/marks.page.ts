import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
//import { Observable } from 'rxjs';

@Component({
  selector: 'app-marks',
  templateUrl: './marks.page.html',
  styleUrls: ['./marks.page.scss'],
})
export class MarksPage implements OnInit {
  tableData: any[] = [];
  scoreData:any;

  constructor(//private menuCtrl: MenuController,
    private firestore: AngularFirestore,
     private db: AngularFirestore) 
     {
      this.getScoreData();
      }
  

  ngOnInit() {
  }
  

  getScoreData() {
    this.db.collection('feedback')
      .valueChanges()
      .subscribe((data: any[]) => {
        this.scoreData = data.map(item => item.Score);
        console.log(this.scoreData);
      });
}
}