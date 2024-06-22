import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit{
  products: Product[] = [];

  constructor(private productService: ProductService,  private toastr:ToastrService,
    private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.spinner.show();
    this.productService.getProducts().subscribe((data) => {
      this.products = data;     
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
 
      console.log(this.products);
    });
  }

  sortProductsByPrice(): void {
    this.spinner.show()
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
    this.products.sort((a, b) => a.price - b.price);
  }
}
