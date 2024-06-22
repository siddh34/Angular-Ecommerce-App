import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/Product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from '../../services/product.service';
declare var bootstrap: any;
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit{
 
  product: any;
  productForm!: FormGroup;
  cartItems: any;
  showGoToCartButton:boolean=false
  cart: any[]=[];
  cartPurchasedDetail:any;
  cartPurchasedDetailQuantity:number=0;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private fb: FormBuilder,
    private router:Router,
    private toastr:ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    const productId:any = this.route.snapshot.paramMap.get('id');
    console.log(productId)
    this.cartService.cart$.subscribe(cart => this.cart = cart);
   this.spinner.show();
    this.productService.getProductById(productId).subscribe(
      (product) => {
        this.product = product;
        this.toastr.success('Detailed Fetched successfully!');
        setTimeout(() => {
          this.spinner.hide();
        }, 2000);
        this.cart.filter((val:any)=>{
          if(val.id==product.id){
            this.showGoToCartButton=true;
          }
        })
        console.log(this.product);
    
        this.createForm();
      },
      (error) => {
        this.toastr.error('Internal Server Error!');
        setTimeout(() => {
          this.spinner.hide();
        }, 2000);
        console.error('Error fetching product', error);
      }
    );


  
  }

  createForm() {
    if (!this.product || !this.product.variants) {
      return;
    }

    this.productForm = this.fb.group({
      variants: this.fb.array(this.product.variants.map((variant:any) => this.fb.group({
        name: variant.name,
        selected: false
      })))
    });
  }
  
  onVariantSelected(index: number) {
    if (this.variants && this.variants.controls) {
      this.variants.controls.forEach((control, idx) => {
        if (idx !== index) {
          control.get('selected')?.setValue(false, { emitEvent: false });
        }
      });
      this.variants.controls[index].get('selected')?.setValue(true);
      
      console.log(this.variants.value);
      
      const selectedVariant = this.variants.controls.find((ctrl:any) => ctrl.get('selected').value);

      console.log(selectedVariant);

      
    this.cartPurchasedDetail =   this.cart.find((val:any)=>{
       return this.variants.value.find((variant:any)=>{
               if( variant.selected && val.selectedVariant.name ==variant.name && this.product.id==val.id){
                 console.log(val)
                 return val;
               }
        })
        
      });
      console.log(this.cartPurchasedDetail,'=================');
      this.cartPurchasedDetailQuantity=this.cartPurchasedDetail?.quantity;
    }

  }

  get variants() {
    return this.productForm.get('variants') as FormArray;
  }

  incrementQuantity(item:any){
    this.addToCart("ADD")
  }
  decrementQuantity(item:any){
   this.addToCart("DELETE")
  }
  addToCart(command:any) { 
    this.cartPurchasedDetail={};
    this.spinner.show();
    const storedCarts = localStorage.getItem('cart');
    if (storedCarts) {
      this.cartItems = JSON.parse(storedCarts);
    }
    console.log(this.cartItems,'=======before');
    
    const selectedVariant = this.variants.controls.find((ctrl:any) => ctrl.get('selected').value);
    console.log(selectedVariant);
  
    if (selectedVariant) {
      this.cartItems = this.cartService.getCartFromLocalStorage(); // Assuming this returns an array of items in the cart

      // Check if the item already exists in the cart
      let existingItem = this.cartItems.find((item: any) => item.id === this.product.id && item.selectedVariant.name === selectedVariant.value.name);
      let actualP:any=0; 
      if (existingItem) {
        // Item exists, increase quantity
         
        this.cart.filter((val:any,index:any)=>{
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
                this.cartPurchasedDetail=null;
                this.cartPurchasedDetailQuantity=0;
              }
              else{
                this.cartPurchasedDetail['quantity']=val.quantity;
                this.cartPurchasedDetailQuantity=val.quantity;
                this.cartPurchasedDetail['actualPrice']= val.actualPrice;
              }
          
            
          }
        });






       this.updateCart();
   
      console.log(this.cartPurchasedDetail,'================');
      
        this.showGoToCartButton = true;
        this.toastr.success('Product added successfully!');
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
      } 
      else {
        // Item doesn't exist, add it with quantity 1
        let newItem:any={};
      if(command=='ADD'){
       newItem = {
          ...this.product,
          selectedVariant: selectedVariant.value,
          quantity: 1,
          actualPrice:this.product.price
        };
      }
      else{
        this.toastr.success('Internal Server Error!');
        return;
      }
        this.cartService.addToCart(newItem); 
        this.cartPurchasedDetail.quantity=newItem.quantity;
              this.cartPurchasedDetailQuantity=newItem.quantity;
              this.cartPurchasedDetail.actualPrice= newItem.actualPrice;
        this.showGoToCartButton = true;
        this.toastr.success('Product added successfully!');
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
      }
    }

    else{
      this.cartPurchasedDetail=null;
      this.cartPurchasedDetailQuantity=0;
      this.toastr.error('Please select the variant!');
        setTimeout(() => {
          this.spinner.hide();
        }, 800);
    }
    //  this.spinner.hide();
    

}

  cancel(){
   localStorage.removeItem('cart');
   console.log(this.cartItems,'======REMOVED');
   
  }
  updateCart() {
    this.cartService.updateCart(this.cart);
    console.log('CART UPDATED');
  }
  goToCart() {
   
    this.router.navigate(['/products/cart']);
  }
  backToProductListPage(){
    this.router.navigate(['products/list'])
  }
}


