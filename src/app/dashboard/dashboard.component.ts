import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isAuth: boolean = false;

  authForm: FormGroup = new FormGroup({
    'user_email': new FormControl(null),
    'user_password': new FormControl(null)
  });

  constructor() { }

  ngOnInit() {
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
}
