import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CartModelServer } from '../../models/cart.model';
import { UserService, ResponseModel } from '../../services/user.service';
import { map } from 'rxjs/operators';
import { SocialUser } from 'angularx-social-login';
import { AddressModelServer, AddressServerResponse } from '../../models/address.model';
import { AddressService } from '../../services/address.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  
  cartTotal: number;
  cartData: CartModelServer;
  myUser: any;
  
  address : AddressModelServer;

  constructor(private cartService: CartService,
              private userService: UserService,
              private router: Router,
              private spinner: NgxSpinnerService,
              private addressService: AddressService) { }

  ngOnInit(): void {

    // this.address.fullname = "";
    // this.address.line1 = "";
    // this.address.line2 = "";
    // this.address.city = "";
    // this.address.state ="";
    // this.address.country ="";
    // this.address.phone = "";
    // this.address.pincode = 0;

    this.cartService.carData$.subscribe(data => this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);

    this.userService.userData$
      .pipe(
        map(user => {
          if(user instanceof SocialUser){
            return {
              ...user,
              email: 'test@test.com'
            };
          } else {
            return user;
          }
        })
      )
      .subscribe((data: ResponseModel | SocialUser) => {
        this.myUser = data;
      })

    if(this.myUser !== null){
      this.addressService.getAddressUser(this.myUser.userId).subscribe((addresses: AddressServerResponse)=> {  
        this.address = addresses.addresses[0];
      })
    }
    
  }

  onCheckout() {

    this.spinner.show().then(p => {
      this.userService.userData$
      .pipe(
        map(user => {
          if(user instanceof SocialUser){
            return {
              ...user,
            };
          } else {
            return user;
          }
        })
      )
      .subscribe((data: ResponseModel | SocialUser) => {
        if(data !== null){
          this.myUser = data;
          this.cartService.CheckoutFromCart(this.myUser.userId);
        } else {
          this.cartService.CheckoutFromCart(1);
        }
        
      })
      
    });
  }

}