import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { firebaseConfig } from 'secret';

@Component({
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  SignOut() {
    firebase.auth().signOut()
    .then((res) => {console.log('signout_res..... ', res)})
    .catch((err) => {console.error('signout_err..... ', err)});
  }
}
