import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AddressServerResponse, AddressSetModelServer } from '../models/address.model';
import { MessageResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private SERVER_URL = environment.SERVER_URL;

  constructor(private http: HttpClient) { }


  /* Obtener las direcciones del usuario */
  getAddressUser(id: number): Observable <AddressServerResponse>{
    return this.http.get<AddressServerResponse>(this.SERVER_URL + '/addresses/' + id);
  }

  /* Agregar una nueva dirección */
  setAddressUser(user_id: number, fullname: string, line1: string, line2: string,
                city: string, state: string, country: string, phone: string, pincode: number){
    return this.http.post(`${this.SERVER_URL}/addresses/add`, {
      user_id, fullname, line1, line2, city, state, country, phone, pincode
    });
  }

  /* Eliminar dirección */
  deleteAddressUser(id: number){
    return this.http.delete(this.SERVER_URL + '/addresses/' + id)
  }

  /* Actualizar Dirección */
  updateAddressUser(id: number, fullname: string, line1: string, line2: string,
    city: string, state: string, country: string, phone: string, pincode: number){
      return this.http.patch(this.SERVER_URL+'/addresses/'+id, {
        fullname, line1, line2, city, state, country, phone, pincode
      })
  }
}
