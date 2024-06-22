import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit{
  isSidebarOpen:boolean=false;
  constructor(private authService:AuthService,private router:Router){

  }
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateActiveState();
      }
    });
    this.updateActiveState();  }

  
    
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  

  setActive(item: any): void {
    this.menuItems.forEach((menuItem:any) => menuItem.isActive = false);
    item.isActive = true;
    this.isSidebarOpen = false; // Close the sidebar
  }

  updateActiveState(): void {
    const activeRoute = this.router.url;
    this.menuItems.forEach((item:any) => {
      item.isActive = activeRoute.includes(item.route);
    });
  }
  

  menuItems: any = [
    { name: 'Product List', isActive: true, route: '/products/list' },
    { name: 'Shop Cart', isActive: false,  route: '/products/cart' },
   
  ];

 
  // getSidebarStatus(event:any){
  //   if(event=='OPEN'){
  //    this.toggleSidebar()
  //   }
  // }

}
