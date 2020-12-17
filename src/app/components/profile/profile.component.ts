import { Component, OnInit } from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { UserService, ResponseModel } from '../../services/user.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { MessageResponse, ProductOrderUserModel } from '../../models/product.model';
import { OrderService } from '../../services/order.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddressService } from '../../services/address.service';
import { AddressModelServer, AddressServerResponse } from 'src/app/models/address.model';


declare var $:any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  myUser: any;

  
  //Orders users
  orders: ProductOrderUserModel[] = [];

  //Edit users
  email: string = "";
  fname: string;
  lname: string;
  username: string;
  age: number;
  Message: MessageResponse;

  //Address
  fullname : string;
  line1 : string;
  line2 : string;
  city : string;
  state : string;
  country : string;
  phone : string;
  pincode : number;



  addresses: AddressModelServer[] = [];
  address: AddressModelServer;
  
  err: boolean = true;
  err2: boolean = true;
  

  constructor(private socialAuthService: SocialAuthService,
              private userService: UserService,
              private router: Router,
              private orderService: OrderService,
              private toast: ToastrService,
              private modalService: NgbModal,
              private addressService: AddressService) { }

  ngOnInit(): void {
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


      //Orders
      this.getOrders();

      //Edit
      this.refreshData();

      //Address
      this.getAddressUser();
      
  }

  getOrders(){
    this.orderService.getOrdersProductsUsers(this.myUser.userId).subscribe((orders: ProductOrderUserModel[])=>{
      if(orders[0] !== undefined){
        this.orders = orders;
      } else {
        this.err2 = false;
      }
      
    });

  }

  logout() {
    this.userService.logout();
    this.router.navigateByUrl('/login')
  }

  editUser(form : NgForm){
    const email = this.email;
    const fname = this.fname;
    const lname = this.lname;
    const username = this.username;
    const age = this.age;

    if(form.invalid){
      return;
    }

    form.reset();

    this.userService.editUser(this.myUser.userId, email, fname, lname, username, age).subscribe((msg:MessageResponse)=> {
        this.Message = msg;
        this.router.navigateByUrl('/login');;
        this.refreshData();
        this.toast.success(`Los cambios se veran actualizados cuando vuelvas a iniciar sesión`, 'Perfil actualizado', {
          timeOut: 2500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
    });


  }
  refreshData(){
      this.email = this.myUser.email;
      this.fname = this.myUser.fname;
      this.lname = this.myUser.lname;
      this.username = this.myUser.username;
      this.age = this.myUser.age;
  }


  getAddressUser(){
    this.addressService.getAddressUser(this.myUser.userId).subscribe((addresses: AddressServerResponse)=> {  
      if(addresses.addresses !== undefined){
        this.addresses = addresses.addresses;
      } else {
        this.err = false; 
      }
      
      
    })
  }


  updateAddressUser(form: NgForm){
    let id = this.address.id;
    let fullname = this.address.fullname;
    let line1 = this.address.line1;
    let line2 = this.address.line2;
    let city = this.address.city;
    let state = this.address.state;
    let country = this.address.country;
    let phone = this.address.phone;
    let pincode = this.address.pincode;

    if(form.invalid){
      return;
    }
    form.reset();


    if (fullname !== null || line1 !== null || line2 || phone !== null
        || state !== null || country !== null || city !== null 
        || pincode !== null){
          if (fullname !== undefined || line1 !== undefined || line2 || phone !== undefined
            || state !== undefined || country !== undefined || city !== undefined 
            || pincode !== undefined){
              
              this.addressService.updateAddressUser(id, fullname, line1, line2,
                  city, state, country, phone, pincode).subscribe((msg: MessageResponse)=> {
                    this.Message = msg;
                    console.log(this.Message);
                    window.location.reload();
                    this.address.id = 0;
                    this.address.fullname = "";
                    this.address.line1 = "";
                    this.address.line2 = "";
                    this.address.state = "";
                    this.address.country = "";
                    this.address.phone = "";
                    this.address.pincode = 0;
                    this.address.city = "";
                  })
          } else {
            console.log("err undefined");
          }
    } else {
      console.log("err null");
    }
  
  }

  deleteAddressUser(a: AddressModelServer){
    this.address = a;
    let id = this.address.id;
    console.log(id);
    if(id !== null && id !== undefined){
      this.addressService.deleteAddressUser(id).subscribe((msg: MessageResponse) => {
        this.Message = msg;
        window.location.reload();
      })
    } else {
      console.log("err null or undefined");
    }
  }

  addAddressUser(form: NgForm){
    let fullname = this.fullname;
    let line1 = this.line1;
    let line2 = this.line2;
    let city = this.city;
    let state = this.state;
    let country = this.country;
    let phone = this.phone;
    let pincode = this.pincode;

    if (fullname !== null && line1 !== null && line2 && phone !== null
      && state !== null && country !== null && city !== null 
      && pincode !== null){
        if (fullname !== undefined && line1 !== undefined && line2 && phone !== undefined
          && state !== undefined && country !== undefined && city !== undefined 
          && pincode !== undefined){
            
            this.addressService.setAddressUser(this.myUser.userId, fullname, line1, line2,
                city, state, country, phone, pincode).subscribe((msg: MessageResponse)=> {
                  this.Message = msg;
                  window.location.reload();
                  this.fullname = "";
                  this.line1 = "";
                  this.line2 = "";
                  this.state = "";
                  this.country = "";
                  this.phone = "";
                  this.pincode = 0;
                  this.city = "";
                })
        } else {
          console.log("err undefined");
        }
  } else {
    console.log("err null");
  }

  }


  modalAddress(a: AddressModelServer, modal: NgbModal){
    this.address = a;
    console.log(this.address.fullname);
    this.modalService.open(modal);
  }

  modalAddressAdd(modal: NgbModal){
    this.modalService.open(modal);
  }

  closeModal(modal: NgbModal){
    this.modalService.dismissAll(modal);
  }

}
