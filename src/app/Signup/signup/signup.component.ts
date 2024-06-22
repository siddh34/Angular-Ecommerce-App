import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
 
  signupForm!: FormGroup;
  submitted = false;
  errorMessage = '';
  successMessage: any;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,
    private toastr:ToastrService,
    private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
    });
  }

  get f() {
    return this.signupForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.spinner.show();
console.log(this.signupForm.value, this.signupForm.valid);

    if (this.signupForm.invalid) {
      this.toastr.error('Invalid Form');
           setTimeout(() => {
          this.spinner.hide();
        }, 1000);
      return;
    }

    const user:any = {
      name: this.f['name'].value as string,
      email: this.f['email'].value as string,
      password: this.f['password'].value as string,
      phoneNumber: this.f['phoneNumber'].value as string
    };

    this.authService.signup(user).subscribe(
      (res:any) => {
        if(res){
          console.log('User registered successfully');
          this.successMessage = 'User registered successfully';
           this.toastr.success(this.successMessage);
           setTimeout(() => {
          this.router.navigate(['/login']);
          this.spinner.hide();
        }, 1000);
       // Redirect to login page after successful registration
        }
        else{
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        }
      
      },
      (error:any) => {
        console.error('Error registering user:', error);
        // this.errorMessage = 'Registration failed. Please try again.';
        this.toastr.error(error)
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
      }
    );
  }
}
