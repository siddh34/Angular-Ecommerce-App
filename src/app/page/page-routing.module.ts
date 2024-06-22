import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { LoginComponent } from '../Login/login/login.component';
import { MainPageComponent } from '../Main/main-page/main-page.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';

const routes: Routes = [
    // {
    //   path: 'list', component: ProductListComponent,
    // },
      { path: 'list', component: ProductListComponent, canActivate: [AuthGuard] },
  { path: 'product/:id', component: ProductDetailsComponent,canActivate: [AuthGuard]  },
  { path: 'cart', component: ShoppingCartComponent, canActivate: [AuthGuard] },
     
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule { }
