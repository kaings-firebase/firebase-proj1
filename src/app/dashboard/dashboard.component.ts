import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { FormGroup, FormControl, NgModel } from '@angular/forms';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isAuth: boolean = false;
  outlineData: any[] = [];
  sharedData: any[] = [];
  user: {uid: string, admin: boolean} = {
    uid: null,
    admin: false
  };

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

        // the following two lines will return object that contains claims of current authenticated user
        // user.getIdTokenResult().then((res) => {console.log('onAuthStateChanged_getIdTokenResult..... ', res)});
        // user.getIdToken().then((res) => {console.log('onAuthStateChanged_getIdToken..... ', res)});

        this.user.uid = user ? user.uid : null;
        this.isAuth = !!user;

        // this way is not subscription, it won't trigger anything when new data is added
        // firebase.firestore().collection('outline_data').get().then(res => {res.docs.map(doc => {console.log('ngOnInit_doc..... ', doc.data())})});

        // onSnapshot will trigger everytime there is new changes in data (add, delete, etc)
        firebase.firestore().collection('submitted').doc(this.user.uid).collection('outline_data').onSnapshot(
          (snapshot) => {
            // console.log('onSnapshot_snapshot..... ', snapshot);
            this.outlineData = [];

            snapshot.docs.map((doc) => {
              // console.log('onInit_snapshot_doc..... ', doc.data());

              this.outlineData.push({...{idx: doc.id}, ...doc.data()});
            })
          },
          (err) => {console.error('onSnapshot_err..... ', err)}
        );

        // load shared data
        firebase.firestore().collection('shared').onSnapshot(
          (snapshot) => {
            console.log('shared_onSnapshot_snapshot..... ', snapshot);

            this.sharedData = [];

            snapshot.docs.map((doc) => {
              console.log('onInit_shared_snapshot_doc..... ', doc.data());

              this.sharedData.push({...{idx: doc.id}, ...doc.data()});
            })
          },
          (err) => {console.error('shared_onSnapshot_err..... ', err)}
        );
      },
      (err) => {
        console.error('err..... ', err);
      }
    );
  }

  onSignIn() {
    firebase.auth().signInWithEmailAndPassword(
      this.authForm.get('user_email').value,
      this.authForm.get('user_password').value
    )
    .then((res) => {
      console.log('signin_res..... ', res);
      this.user.uid = res.user.uid;
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

    firebase.firestore().collection('submitted').doc(this.user.uid).collection('outline_data').add({
      outline: this.outlineDataForm.get('outline').value,
      description: this.outlineDataForm.get('description').value,
      creator: this.user.uid
    })
    .then((res) => {console.log('onAddData_res..... ', res)})
    .catch((err) => {console.error('onAddData_err..... ', err)});
  }

  onDeleteData(idx: string) {
    console.log('idx..... ', idx);
    firebase.firestore().collection('submitted').doc(this.user.uid).collection('outline_data').doc(idx).delete()
    .then((res) => {console.log('onDeleteData_res..... ', res)})
    .catch((err) => {console.log('onDeleteData_err..... ', err)});
  }

  onAddSharedData() {
    firebase.firestore().collection('shared').add({
      outline: this.outlineDataForm.get('outline').value,
      description: this.outlineDataForm.get('description').value,
      creator: this.user.uid
    })
    .then((res) => {console.log('onAddSharedData_res..... ', res)})
    .catch((err) => {console.error('onAddSharedData_err..... ', err)});
  }

  onDeleteSharedData(idx: string) {
    console.log('shared_idx..... ', idx);

    firebase.firestore().collection('shared').doc(idx).delete()
    .then((res) => {console.log('onDeleteSharedData_res..... ', res)})
    .catch((err) => {console.error('onDeleteSharedData_err..... ', err)});
  }

  onSetAdmin(input: NgModel) {
    console.log('onSetAdmin_input..... ', input.control.value);


  }
}
