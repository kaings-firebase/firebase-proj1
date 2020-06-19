import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isAuth: boolean = false;
  outlineData: any[] = [];

  authForm: FormGroup = new FormGroup({
    'user_email': new FormControl(null),
    'user_password': new FormControl(null)
  });

  outlineDataForm: FormGroup = new FormGroup({
    'outline': new FormControl(null),
    'description': new FormControl(null)
  });

  constructor() { }

  ngOnInit() {
    // this subscription fires everytime there is changes in auth state. e.g.: signin, signout, signup
    firebase.auth().onAuthStateChanged(
      (user) => {
        console.log('onAuthStateChanged_user..... ', user);
        this.isAuth = !!user;
      },
      (err) => {
        console.error('err..... ', err);
      }
    );

    // this way is not subscription, it won't trigger anything when new data is added
    // firebase.firestore().collection('outline_data').get().then(res => {res.docs.map(doc => {console.log('ngOnInit_doc..... ', doc.data())})});

    // onSnapshot will trigger everytime there is new changes in data (add, delete, etc)
    firebase.firestore().collection('outline_data').onSnapshot(
      (snapshot) => {
        // console.log('onSnapshot_snapshot..... ', snapshot);
        this.outlineData = [];

        snapshot.docs.map((doc) => {
          console.log('onInit_snapshot_doc..... ', doc.data());

          this.outlineData.push({...{idx: doc.id}, ...doc.data()});
        })
      },
      (err) => {console.error('onSnapshot_err..... ', err)}
    );

  }

  onSignIn() {
    firebase.auth().signInWithEmailAndPassword(
      this.authForm.get('user_email').value,
      this.authForm.get('user_password').value
    )
    .then((res) => {
      console.log('signin_res..... ', res);
    })
    .catch((err) => {
      console.error('signin_err..... ', err);
    });
  }

  onSignUp() {
    firebase.auth().createUserWithEmailAndPassword(
      this.authForm.get('user_email').value,
      this.authForm.get('user_password').value
    )
    .then((res) => {
      console.log('signup_res...... ', res);
    })
    .catch((err) => {
      console.error('signup_err..... ', err);
    });
  }

  onAddData() {
    console.log('onAddData..... ', this.outlineDataForm);

    firebase.firestore().collection('outline_data').add({
      outline: this.outlineDataForm.get('outline').value,
      description: this.outlineDataForm.get('description').value
    })
    .then((res) => {console.log('onAddData_res..... ', res)})
    .catch((err) => {console.error('onAddData_err..... ', err)});
  }

  onDeleteData(idx: string) {
    console.log('idx..... ', idx);
    firebase.firestore().collection('outline_data').doc(idx).delete()
    .then((res) => {console.log('onDeleteData_res..... ', res)})
    .catch((err) => {console.log('onDeleteData_err..... ', err)});
  }
}
