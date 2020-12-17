import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ProductOrderUserModel } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private products: ProductResponseModel[] = [];
  private SERVER_URL = environment.SERVER_URL;

  constructor(private http : HttpClient) { }

  getSingleOrder(orderId: number){
    return this.http.get<ProductResponseModel[]>(this.SERVER_URL + '/orders/' + orderId).toPromise();
  }

  getOrdersProductsUsers(userId: number){
    return this.http.get<ProductOrderUserModel[]>(this.SERVER_URL+ '/orders/' + userId);
  }

}

//For getSingleOrder
interface ProductResponseModel {
  id: number;
  title: string;
  description: string;
  price: number;
  quantityOrdered: number;
  image: string;
}

