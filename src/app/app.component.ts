import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ecommerce-app';

  getUrl()
{
  return "url('https://www.shutterstock.com/image-vector/vector-realistic-isolated-neon-sign-260nw-1188351907.jpg')";
}
}
