import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  

  private cart = new BehaviorSubject<any[]>(this.getCartFromLocalStorage());
  cart$ = this.cart.asObservable();

  public addToCart(product: any) {
    let mainData:any = [];
    
    const currentCart:any = this.getCartFromLocalStorage();
  
    const updatedCart = [...currentCart, product];
  
let groupedProducts:any = {};

updatedCart.forEach(product => {
    let key = `${product.id}-${product.selectedVariant.name}`;
    if (!groupedProducts[key]) {
        groupedProducts[key] = { ...product };
    } else {
        if (product.quantity > groupedProducts[key].quantity) {
            groupedProducts[key] = { ...product };
        }
    }
});

let mergedProducts = Object.values(groupedProducts);

console.log(JSON.stringify(mergedProducts, null, 2));

   
    this.cart.next(mergedProducts);
    console.log('MERGED PRODCTS','=============');
    
    this.saveCartToLocalStorage(mergedProducts);
  }

  updateCart(products: any[]) {
    this.cart.next(products);
    this.saveCartToLocalStorage(products);
  }

  private saveCartToLocalStorage(cart: any[]) {
    if (cart.length === 0) {
      localStorage.removeItem('cart');
    } else {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }
  public clearCart() {
    this.cart.next([]);
    this.saveCartToLocalStorage([]);
  }

  public getCartFromLocalStorage() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart;
  }

 
  

}

