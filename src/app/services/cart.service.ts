import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductService } from './product.service';
import { OrderService } from './order.service';
import { environment } from '../../environments/environment';
import { CartModelPublic, CartModelServer } from '../models/cart.model';
import { BehaviorSubject } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ProductModelServer } from '../models/product.model';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private SERVER_URL = environment.SERVER_URL;

  // Información del carrito en local storage
  private cartDataClient: CartModelPublic = {
    total: 0,
    prodData: [{
      incart: 0,
      id: 0
    }]
  };

  // Información en el server
  private cartDataServer: CartModelServer = {
    total: 0,
    data: [{
      numInCart: 0,
      product: undefined
    }]
  };

  /* Observables para el suscribirse a los componentes */
  cartTotal$ = new BehaviorSubject<number>(0);
  carData$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);
  

  constructor(private http: HttpClient,  
              private productService: ProductService,
              private orderService: OrderService,
              private router: Router,
              private toast: ToastrService,
              private spinner: NgxSpinnerService) { 
  
    this.cartTotal$.next(this.cartDataServer.total);
    this.carData$.next(this.cartDataServer);
  
    // Obtener la información del local storoge (Si existe)
    let info : CartModelPublic = JSON.parse(localStorage.getItem('cart'));

    // Verificar si la info es null o tiene información
    if(info !== null && info !== undefined && info.prodData[0].incart !== 0){
      //local storage no esta vacia y tiene información
      this.cartDataClient = info;
          // Recorrer cada entrada y ponerla en el objeto cartDataServer
      this.cartDataClient.prodData.forEach(p => {
        this.productService.getSingleProduct(p.id).subscribe((actualProductInfo: ProductModelServer) => {
        if(this.cartDataServer.data[0].numInCart === 0){
          this.cartDataServer.data[0].numInCart = p.incart;
          this.cartDataServer.data[0].product = actualProductInfo;


          // TODO Crear CalculteTotal funcion y reemplazar
          this.CalculateTotal();
          this.cartDataClient.total = this.cartDataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));

        } else {
          // CartDataServer ya tiene entradas
          this.cartDataServer.data.push({
            numInCart: p.incart,
            product: actualProductInfo
          });
          // TODO Crear CalculteTotal funcion y reemplazar
          this.CalculateTotal();
          this.cartDataClient.total = this.cartDataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        }
        this.carData$.next({... this.cartDataServer});
        });
      });
    }
  }

  AddProductToCart(id:number, quantity?: number){
    this.productService.getSingleProduct(id).subscribe(prod =>{
      // 1. Si el carrito esta vacío
      if(this.cartDataServer.data[0].product === undefined){
        this.cartDataServer.data[0].product = prod;
        this.cartDataServer.data[0].numInCart = quantity !== undefined ? quantity : 1;
        
        // TODO calcular el total a pagar
        this.CalculateTotal();
        this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
        this.cartDataClient.prodData[0].id = prod.id;
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.carData$.next({ ... this.cartDataServer});

        // TODO mostrar notificación
        this.toast.success(`${prod.name} agregado al carrito`, 'Producto Agregado', {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      }
      // 2. Si el carrito tiene items
      else {
        let index = this.cartDataServer.data.findIndex(p => p.product.id === prod.id);

        //   a. Si el item ya esta en el carrito
        if(index !== -1){
          if(quantity !== undefined && quantity <= prod.quantity){
            this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? quantity : prod.quantity;
          }else{
            this.cartDataServer.data[index].numInCart < prod.quantity ?this.cartDataServer.data[index].numInCart++ : prod.quantity;
          }

          this.cartDataClient.prodData[index].incart = this.cartDataServer.data[index].numInCart;
          // // TODO calcular el total a pagar
          this.CalculateTotal();
          this.cartDataClient.total = this.cartDataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          // TODO mostrar notificación
          this.toast.info(`${prod.name} Cantidad actualizada en el carrito`, 'Producto Actualizado', {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
          
        } // END IF
        //   b. Si el item no esta en el carrito
        else{
          this.cartDataServer.data.push({
            numInCart: 1,
            product: prod
          });
          
          this.cartDataClient.prodData.push({
            incart: 1,
            id: prod.id
          });

          
          // TODO mostrar notificación
          this.toast.success(`${prod.name} agregado al carrito`, 'Producto agregado', {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });

          this.CalculateTotal();
          this.cartDataClient.total = this.cartDataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.carData$.next({... this.cartDataServer}); 
        } //END ELSE
      }
    });
  }

  UpdateCartItems(index: number, increase: boolean) {
    let data = this.cartDataServer.data[index];

    if(increase){
      data.numInCart < data.product.quantity ? data.numInCart++ : data.product.quantity;
      this.cartDataClient.prodData[index].incart = data.numInCart;

      // TODO calcular el total a pagar
      this.CalculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      this.carData$.next({... this.cartDataServer});
    } else {
      data.numInCart--;

      if(data.numInCart < 1){
        // Eliminar el producto del carrito
        this.DeleteProductFromCart(index);
        this.carData$.next({... this.cartDataServer});
      } else {
        this.carData$.next({... this.cartDataServer});
        this.cartDataClient.prodData[index].incart = data.numInCart;

         // TODO calcular el total a pagar
        this.CalculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
    }
  }

  DeleteProductFromCart(index: number){
    if(window.confirm('¿Estás seguro que quieres eliminar este producto?')){
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClient.prodData.splice(index, 1);
      
      // TODO calcular el total a pagar
      this.CalculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;

      if(this.cartDataClient.total === 0){
        this.cartDataClient = {total: 0, prodData: [{incart: 0, id: 0}] };
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      } else {
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }

      if(this.cartDataServer.total === 0){
        this.cartDataServer = {total: 0, data: [{numInCart: 0, product: undefined}]};
        this.carData$.next({... this.cartDataServer});
      } else {
        this.carData$.next({... this.cartDataServer});
      }

    }else {
      // Si el usuario clickea en cancelar
      return;
    }
  }

  CalculateSubTotal(index): number {
    let subtotal = 0;
    const p = this.cartDataServer.data[index];
    subtotal = p.product.price * p.numInCart;
    return subtotal;
  }

  private CalculateTotal(){
    let Total = 0;

    this.cartDataServer.data.forEach(p => {
      const {numInCart} = p;
      const {price} = p.product;

      Total += numInCart * price;
    });
    this.cartDataServer.total = Total;
    this.cartTotal$.next(this.cartDataServer.total);
  }

  CheckoutFromCart(userId: number){
    this.http.post(`${this.SERVER_URL}/orders/payment`, null).subscribe((res: {success: boolean}) => {
        if (res.success){
          this.resetServerData();
          this.http.post(`${this.SERVER_URL}/orders/new`, {
            userId: userId,
            products: this.cartDataClient.prodData
          }).subscribe((data: OrderResponse) => {
            
            this.orderService.getSingleOrder(data.order_id).then(prods => {
              if(data.success){

                const navigationExtras: NavigationExtras = {
                  state: {
                    message: data.message,
                    products: prods,
                    orderId: data.order_id,
                    total: this.cartDataClient.total
                  }
                };

                // TODO Ocultar spinner
                this.spinner.hide();

                this.router.navigate(['/thankyou'], navigationExtras).then(p => {
                  this.cartDataClient = { total: 0, prodData: [{incart: 0, id: 0}]};
                  this.cartTotal$.next(0);
                  localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                });
              }
            });       
          });
        } else {
          this.spinner.hide();
          this.router.navigateByUrl('/checkout').then();
          this.toast.error(`Lo sentimos ha ocurrido un error con el pedido`, 'Estatus del Pedido', {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
        }
    });
  }

  private resetServerData(){
    this.cartDataServer = {
      total: 0,
      data: [{
        numInCart: 0,
        product: undefined
      }]
    };


    this.carData$.next({... this.cartDataServer});
  }

}

interface OrderResponse {
  order_id: number;
  success: boolean;
  message: string;
  products: [{
    id: string,
    numInCart: string
  }];
}
