import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  errorMessage: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr:ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}
  submitted:boolean=false;
  onSubmit(): void {
    this.submitted=true;
    this.spinner.show();
    if (this.loginForm.valid) {
      
      this.authService.login(this.loginForm.value).subscribe((response:any) => {
     
        if(response.Status && response.Data){

          const Token = this.token();
          this.toastr.success('Login Success!');
         
          console.log(Token)
          localStorage.setItem('token', Token);
         
          setTimeout(() => {
            this.spinner.hide();
            this.router.navigate(['/products/list']);
          }, 1000);
         
        }
       else{
        this.errorMessage = response.Status;
        this.toastr.error(this.errorMessage);
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
       
       
       }
      });
    }
    else{
  this.toastr.error('Invalid form');
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
       
    }
  }

  
  token = () => {
    return Math.random().toString(36).substr(2); + Math.random().toString(36).substr(2);
  };

  hideSpinner(){
    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
  }
  
  
  
}
