import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

	public name: string = '';
	public email: string = '';
	public password: string = '';
	public confirm_password: string = '';
	public type: number = 1;
	public terms: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  signUp() {

  	console.log(this.name, this.email, this.password, this.confirm_password, this.type, this.terms);

		var nameParts = this.name.split(/\s(.+)?/);
		var firstName = nameParts[0];
		var lastName = nameParts[1] ? nameParts[1].trim() : null;

  	let body = {
  		firstName: firstName,
  		lastName: lastName,
  		email: this.email,
  		password: this.password,
  		type: this.type
  	};

  	this.http.post('/v1/sign-up', body).subscribe(
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
