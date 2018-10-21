import { Component, Renderer } from '@angular/core'
import { Platform, DomController } from 'ionic-angular'
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion';

@Component({
  selector: 'photo-tilt',
  templateUrl: 'photo-tilt.html',
})
export class PhotoTiltComponent {

  data: any;
  subscription: any;
  cards: number[] = []

  constructor(public platform: Platform,
    public domCtrl: DomController,
    public renderer: Renderer,
    public deviceMotion: DeviceMotion) {
    for (let index = 0; index < 50; index++) {
      this.cards.push(index)
    }
  }

  public startMonitor() {
    var option: DeviceMotionAccelerometerOptions = {
      frequency: 200
    };

    this.subscription = this.deviceMotion.watchAcceleration(option).subscribe((acceleration: DeviceMotionAccelerationData) => {
      this.data = acceleration;
    });
  }

  public stopMonitor() {
    this.subscription.unsubscribe();
  }




}