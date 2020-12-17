import { Component, OnInit } from '@angular/core';
import { ProductComponent } from '../product/product.component';
import { ProductService } from '../../services/product.service';
import { ThrowStmt } from '@angular/compiler';
import { Router } from '@angular/router';
import { ProductModelServer, ServerResponse } from '../../models/product.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  products: ProductModelServer[] = [];

  constructor(private productService: ProductService,
              private cartService: CartService,
              private router: Router) { }

  ngOnInit(): void {

    /*Obtener productos del servicio*/
    this.productService.getAllProducts(9).subscribe((prods: ServerResponse) => {
      this.products = prods.products;
    })
  }

  selectProduct(id: number){
    this.router.navigate(['/product', id]).then();
  }

  AddToCart(id: number){
    this.cartService.AddProductToCart(id);
  }

  goCategory(category: string){
    this.router.navigate(['/category', category]).then();
  }
}
