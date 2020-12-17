import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { ProductModelServer, ServerResponse } from '../../models/product.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  category: string;
  products: ProductModelServer[] = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private productService: ProductService) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map((param: any) => {
        return param.params.cat;
      })
    ).subscribe(category => {
      this.category = category;
      this.productService.getProductsCategory(this.category).subscribe((prods: ServerResponse) => {
        this.products = prods.products;
      });
    });
  }


  selectProduct(id: number){
    this.router.navigate(['/product', id]).then();
  }

}
