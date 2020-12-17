import { Injectable } from '@angular/core';
import { SocialAuthService, SocialUser, GoogleLoginProvider } from 'angularx-social-login';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MessageResponse } from '../models/product.model';
import { Observable, of } from 'rxjs';
import {catchError} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  auth: boolean = false;
  private SERVER_URL:string = environment.SERVER_URL;
  authState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.auth);
  userData$: BehaviorSubject<SocialUser | ResponseModel> = new BehaviorSubject<SocialUser | ResponseModel>(null);
  loginMessage$ = new BehaviorSubject<string>(null);
  userRole: number;
  
  constructor(private socialAuthService: SocialAuthService,
              private httpClient: HttpClient) { 
        
      
      this.authState$.next(JSON.parse(localStorage.getItem('authState')));
      this.userData$.next(JSON.parse(localStorage.getItem('userData')));
      

      this.authState$.subscribe((auth => {
        this.auth = auth;
      }))
      

      // socialAuthService.authState.subscribe((user: SocialUser) => {
      //   if(user !== null){
      //     this.auth = true;
      //     this.authState$.next(this.auth);
      //     this.userData$.next(user);
      //   }
      // });
  }

  //Login User with email and password
  loginUser(email: string, password: string){
    this.httpClient.post<ResponseModel>(`${this.SERVER_URL}/auth/login`, {email, password})
      .pipe(catchError((err: HttpErrorResponse) => of(err.error.message)))
      .subscribe((data: ResponseModel) => {
        if (typeof (data) === 'string' || data === undefined) {
          this.loginMessage$.next("Comprueba que sea correcto tu email o contraseña");
        } else {
          this.auth = data.auth;
          this.userRole = data.role;
          this.authState$.next(this.auth);
          this.userData$.next(data);
          localStorage.setItem('authState', JSON.stringify(this.auth));
          localStorage.setItem('userData', JSON.stringify(data));
        }
      })
  }

  registerUser(email: string, password: string, fname: string, lname: string): Observable <MessageResponse>{
    return this.httpClient.post<MessageResponse>(`${this.SERVER_URL}/auth/register`,{email, password, fname, lname});
  }

  // Google Authentication
  googleLogin(){
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  logout() {
    // this.socialAuthService.signOut();
    localStorage.removeItem('authState');
    localStorage.removeItem('userData');
    this.auth = false;
    this.authState$.next(this.auth);
  }

  editUser(userId: number, email: string, fname: string, lname: string, username: string, age: number) : Observable <MessageResponse>{
    return this.httpClient.patch<MessageResponse>(`${this.SERVER_URL}/users/${userId}`, {email, fname, lname, username, age});
  }
}

export interface ResponseModel {
  token: string;
  auth: boolean;
  email: string;
  username: string;
  fname: string;
  lname: string;
  photoUrl: string;
  userId: number;
  type: string;
  role: number;
  age: number;
}

interface localUserModel {
  autState$: BehaviorSubject<boolean>,
  userData$: BehaviorSubject<SocialUser | ResponseModel>
}