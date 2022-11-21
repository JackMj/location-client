import { Component } from '@angular/core';
import { WebSocketService } from 'src/web-socket.service';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'geo-server';
  position = {
    latitude: '',
    longitude: '',
  };

  options = {
    enableHighAccuracy: true,
  };
  userForm!: FormGroup;
  constructor(private websocketService: WebSocketService) {}

  ngOnInit() {
    this.userForm = new FormGroup({
      firstName: new FormControl(''),
      company: new FormControl(''),
    });

    this.websocketService.listen('location').subscribe((data) => {
      console.log('data: ', data);
    });
    this.locationManager();
  }

  save = () => {
    const { firstName, company } = this.userForm.value;
    this.websocketService.joinCompany({ firstName, company })
  };

  locationManager() {
    setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          this.successCallback,
          this.errorCallback,
          this.options
        );
      }
    }, 10000);
  }

  successCallback = (position: any) => {
    console.log("position: ", position);
    
    setInterval(() => {
      const { firstName, company } = this.userForm.value;
      this.websocketService.emit('user-location', {
        username: firstName,
        company: company,
        latitude: position.coords.latitude || '',
        longitude: position.coords.longitude || '',
        accuaracy: position.accuaracy,
        speed: position.speed,
      });
    }, 10000);
  };

  errorCallback = (error: any) => {
    console.log(error);
  };

  ngOnDestroy() {
    this.websocketService.disconnect();
  }
}
