import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isAuth: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  onSignIn() {

  }

  onSignUp() {

  }
}
