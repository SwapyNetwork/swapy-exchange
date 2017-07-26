import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	public email: string = '';
	public password: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  login() {
  	let body = {
  		email: this.email,
  		password: this.password
  	};

  	this.http.post('/v1/login', body).subscribe(
			// Successful responses call the first callback.
	    data => {
	    	console.log(data);
	    },
	    // Errors will call this callback instead:
	    err => {
	      console.log(err);
	    }
		);
  }

}
