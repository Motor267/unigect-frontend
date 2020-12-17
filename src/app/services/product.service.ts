import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ProductModelServer, ServerResponse, ProductSearchModel } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private SERVER_URL = environment.SERVER_URL;
  constructor(private http: HttpClient) { }

  /* Obtener todos los productos del backend */
  getAllProducts(numOfResults=10) : Observable<ServerResponse>{
    return this.http.get<ServerResponse>(this.SERVER_URL + '/products', {
      params:{
        limit : numOfResults.toString()
      }
    });
  }

  /* Obtener un producto del servidor */
  getSingleProduct(id: number) : Observable<ProductModelServer>{
    return this.http.get<ProductModelServer>(this.SERVER_URL + '/products/' + id);
  }

  /* Obtener los productos por categoría */
  getProductsCategory(catName: string) : Observable<ServerResponse>{
    return this.http.get<ServerResponse>(this.SERVER_URL + '/products/category/' + catName);
  }

  /* Obtener un productos del buscador */
  getProductsSearch(search: string) : Observable<ProductSearchModel[]>{
    return this.http.get<ProductSearchModel[]>(this.SERVER_URL + `/products/search/${search}`);
  }

}
