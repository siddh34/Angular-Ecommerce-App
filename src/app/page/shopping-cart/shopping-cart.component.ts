import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/Product';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
declare var $: any;

import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit{
 
  
  totalPrice:any=0;
  cart: any = [];

  ngAfterViewInit(): void {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }
  constructor(private cartService: CartService,private router:Router, private authService:AuthService,
    private toastr:ToastrService,
    private spinner: NgxSpinnerService) {}

  ngOnInit(): void {

    this.cartService.cart$.subscribe(cart => this.cart = cart);
    console.log(this.cart);
    
    this.getTotal();
    
   
  }
  totalQuantity:number=0;
  getTotal(){
    this.totalQuantity=0;
    if(this.cart.length<=1){
      let Price= this.cart[0]?.actualPrice;
      this.totalPrice = parseFloat(Price).toFixed(2)
      this.totalQuantity=this.cart[0]?.quantity;
   }
    else{
      var total= this.cart?.reduce((accumulator:any,item:any)=>{
        console.log(accumulator,'==,' ,item);
        this.totalQuantity += item.quantity;
        return accumulator += Number(item.actualPrice);
      },0)
      this.totalPrice = parseFloat(total).toFixed(2);
    }
    
   console.log('TOTAL QUANTITY',this.totalQuantity);
   
  
    console.log('TOTAL PERICE', '===============', this.totalPrice);
  }

  buyNow(){

    // alert("Website in in Development Phase")
    // this.router.navigate(['/buyNowPage'])
  }

  updateCart() {
    this.cartService.updateCart(this.cart);
    console.log('CART UPDATED');
  
  }
  incrementQuantity(item: any,index:number) {
    this.spinner.show();
    this.cart = this.AddRemoveByOneCart(this.cart,item,index,"ADD");
    this.updateCart();
    this.getTotal();
    this.toastr.success('Product quantity incremented successfully!');
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }

  decrementQuantity(item: any,index:number) {
    this.spinner.show();
    if (item.quantity > 1) {
      console.log(item,index);
      this.cart = this.AddRemoveByOneCart(this.cart,item,index,"REMOVE");
  
    }
    else{
      this.removeFromCart(index);

    }
    this.updateCart();
    this.getTotal();
    this.toastr.success('Product Quantity Decremented successfully!');
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }

  removeFromCart(index: number) {
    this.spinner.show();
    this.cart.splice(index, 1);
   
    console.log('CARTREMOVED  UPDATED');
    this.updateCart();
    this.getTotal();
    this.toastr.success('Product deleted successfully!');
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }

  
  AddRemoveByOneCart(cart:any,item:any, index:any,command:string) {

    const existingItem = cart.find((citem: any) => citem.id === item.id && citem.selectedVariant.name === item.selectedVariant.name);
 
    cart.filter((val:any,index:any)=>{
      if(val.id==existingItem.id && val.selectedVariant.name==existingItem.selectedVariant.name){
        if(command=="ADD"){
          val.quantity= val.quantity ? val.quantity+1: 1;
        }
        else{
          val.quantity= val.quantity ? val.quantity-1:0;
        }
         
        
          let actualP:any = Number(val.price*val.quantity);
       val.actualPrice =  parseFloat(actualP).toFixed(2);
         if(val.quantity<=0){
           this.cart.splice(index,1);
         }
      }
    });
    console.log(this.cart,'====================currentcart');
    
    this.updateCart();
     console.log(cart,'==============');
    return cart;
    //console.log(cart,'==============');
    
     
  }
logout(){
  this.spinner.show();
  this.authService.logout();
  this.toastr.success('Logout successfully!');
  setTimeout(() => {
    this.router.navigate(['/'])
    this.spinner.hide();
  }, 1000);
  
}

  
}

