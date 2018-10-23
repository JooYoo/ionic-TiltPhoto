import { Component, Renderer, ViewChild } from '@angular/core'
import { Platform, DomController, Content } from 'ionic-angular'
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation';


@Component({
  selector: 'photo-tilt',
  templateUrl: 'photo-tilt.html',
})
export class PhotoTiltComponent {

  accData: any;
  accTimeStamp: any
  disX: any
  disY: any
  disZ: any
  isFirstTimeStamp: boolean = true
  firstTimeStamp: any

  headingAccuracy:any
  magneticHeading:any
  oriTimeStamp:any
  trueHeading:any



  subscription: any;
  cards: number[] = []

  @ViewChild('scroll') scroll: any;

  constructor(public platform: Platform,
    public domCtrl: DomController,
    public renderer: Renderer,
    public deviceMotion: DeviceMotion,
    public deviceOrientation: DeviceOrientation) {

    // generate Cards
    for (let index = 0; index < 50; index++) {
      this.cards.push(index)
    }
  }

  // public startMonitor() {
  //   var option: DeviceMotionAccelerometerOptions = {
  //     frequency: 200
  //   };

  //   this.subscription = this.deviceMotion.watchAcceleration(option).subscribe((acceleration: DeviceMotionAccelerationData) => {
  //     this.accData = acceleration;
  //     this.accTimeStamp = acceleration.timestamp 
  //     this.getDistance(this.accData,this.accTimeStamp)
  //   });
  // }

  // getDistance(acceleration: any, currentTimeStamp:any){

  //   // get first TimeStamp
  //   if(this.isFirstTimeStamp){
  //     this.firstTimeStamp = currentTimeStamp
  //     this.isFirstTimeStamp = false
  //   }

  //   // get Time
  //   let disTime = currentTimeStamp - this.firstTimeStamp

  //   // get result = 1/2 * (a*t^2)
  //   this.disX = (Math.round(acceleration.x) * Math.pow(disTime, 2)) / 2
  //   this.disY = (Math.round(acceleration.y) * Math.pow(disTime, 2)) / 2
  //   this.disZ = (Math.round(acceleration.z) * Math.pow(disTime, 2)) / 2
  // }

  // public stopMonitor() {
  //   this.subscription.unsubscribe();
  // }

  public scrollToRight(): void {
    //this.scroll._scrollContent.nativeElement.scrollLeft = 500;
  }

  public startMonitor() {
    // Get the device current compass heading
    this.deviceOrientation.getCurrentHeading().then(
      (data: DeviceOrientationCompassHeading) => console.log(data),
      (error: any) => console.log(error)
    );

    // Watch the device compass heading change
    this.subscription = this.deviceOrientation.watchHeading().subscribe(
      (data: DeviceOrientationCompassHeading) => {
        this.accData = data
        this.headingAccuracy = data.headingAccuracy
        this.magneticHeading = data.magneticHeading
        this.oriTimeStamp = data.timestamp
        this.trueHeading = data.trueHeading
      });

  }

  public stopMonitor() {
    // Stop watching heading change
    this.subscription.unsubscribe();
  }




}