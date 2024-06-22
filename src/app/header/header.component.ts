import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private router:Router, private authService:AuthService,  private toastr:ToastrService,
    private spinner: NgxSpinnerService){
    
  }
  logout(){
    this.spinner.show();
    this.authService.logout();
    this.toastr.success('Logout Success!');
     
    setTimeout(() => {
      this.spinner.hide();
      this.router.navigate(['/']);
    }, 2000);
 
  }
}
