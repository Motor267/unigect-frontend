import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductSearchModel } from '../../models/product.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  search: string;
  products: ProductSearchModel[] = [];

  constructor(private productService: ProductService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map((param: any) => {
        return param.params.searchQry;
      })
    ).subscribe(search => {
      this.search = search;
      this.productService.getProductsSearch(this.search).subscribe((prods: ProductSearchModel[]) => {
        this.products = prods;
      });
    });
  }

  selectProduct(id: number){
    this.router.navigate(['/product', id]).then();
  }

}
