import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;
  loginMessage: string;
  error: boolean;

  constructor(private router: Router,
              private userService: UserService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userService.authState$.subscribe(authState => {
      if(authState){
        this.router.navigateByUrl(this.route.snapshot.queryParams['returnUrl'] || '/profile');
      } else {
        this.router.navigateByUrl('/login');
      }
    });
  }

  signInWithGoogle() {
    this.userService.googleLogin();
  }

  login (form: NgForm) {
    const email = this.email;
    const password = this.password;

    if(form.invalid){
      this.error = true;
      return;
    }

    form.reset();

    
    if(email !== null || email !== undefined || password !== null || password !== null){
       this.userService.loginUser(email, password);
    } else {
      this.error = true;
    }
    

    this.userService.loginMessage$.subscribe(msg => {
      this.loginMessage = msg;
    });
  }
}
