import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './Login/login/login.component';
import { ShoppingCartComponent } from './page/shopping-cart/shopping-cart.component';
import { ProductDetailsComponent } from './page/product-details/product-details.component';
import { ProductListComponent } from './page/product-list/product-list.component';
import { AppComponent } from './app.component';
import { MainPageComponent } from './Main/main-page/main-page.component';
import { SignupComponent } from './Signup/signup/signup.component';


const routes: Routes = [
  
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
   {path:'signup', component:SignupComponent},
  {
    path: 'products',
    component: MainPageComponent,
    canActivate: [AuthGuard], // Protect main component and its children
    loadChildren: () => import('./page/page.module').then(m => m.PageModule)
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
