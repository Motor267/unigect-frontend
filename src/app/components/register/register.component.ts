import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MessageResponse } from '../../models/product.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  email: string;
  password: string;
  fname: string;
  lname: string;
  registerMessage: MessageResponse;
  error: boolean;

  constructor(private router: Router,
              private userService: UserService,
              private route: ActivatedRoute) { 
                this.error = false;
              }

  ngOnInit(): void {
  }

  register(form : NgForm){
    const email = this.email;
    const password = this.password;
    const fname = this.fname;
    const lname = this.lname;

    if(form.invalid){
      return;
    }

    form.reset();

    if(email !== null || password !== null || fname !== null || lname !== null){
      if(email !== undefined || password !== undefined || fname !== undefined || lname !== undefined){
        this.userService.registerUser(email, password, fname, lname).subscribe((msg: MessageResponse) => {
          this.router.navigateByUrl('/welcome');
          this.registerMessage = msg;
          console.log(this.registerMessage);
        });
      } else {
        console.log("Error undefined");
        this.error = true;
      }
    } else {
      console.log("Error null");
      this.error = true;
    }
    

    
  }


  
}

