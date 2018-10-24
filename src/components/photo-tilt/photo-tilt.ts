import { Component, Renderer, ViewChild } from '@angular/core'
import { Platform, DomController, Content } from 'ionic-angular'
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion';


@Component({
  selector: 'photo-tilt',
  templateUrl: 'photo-tilt.html',
})
export class PhotoTiltComponent {

  accData: any;
  getAccData: any;
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
  subscription2: any;
  cards: number[] = []

  @ViewChild('content') content: Content;

  constructor(public platform: Platform,
    public domCtrl: DomController,
    public renderer: Renderer,
    public deviceMotion: DeviceMotion,
    public deviceOrientation: DeviceOrientation) {

    // generate Cards
    for (let index = 0; index < 50; index++) {
      this.cards.push(index)
    }
   
   // 
  }

  

  public startMonitor() {
    var option: DeviceMotionAccelerometerOptions = {
      frequency: 5
    };

    this.subscription = this.deviceMotion.watchAcceleration(option).
         subscribe((acceleration: DeviceMotionAccelerationData) => {
      this.accData = acceleration;
      this.accTimeStamp = acceleration.timestamp 
      this.getDistance(this.accData,this.accTimeStamp)
    });

    this.deviceMotion.getCurrentAcceleration().then(
      (acceleration: DeviceMotionAccelerationData) => {
        this.getAccData = acceleration
      });


  }

  getDistance(acceleration: any, currentTimeStamp:any){

    // get first TimeStamp
    if(this.isFirstTimeStamp){
      this.firstTimeStamp = currentTimeStamp
      this.isFirstTimeStamp = false
    }

    // get Time
    let disTime = currentTimeStamp - this.firstTimeStamp

    // get 
    this.disX = Number(acceleration.x).toFixed(0)  
    this.disY = Number(acceleration.y).toFixed(0) 
    this.disZ = Number(acceleration.z).toFixed(0) 

    // scroll it
    this.toScroll()
  }

  public stopMonitor() {
    this.subscription.unsubscribe();
  }

  public toScroll(): void {
    //this.scroll._scrollContent.nativeElement.scrollTop = this.disZ
    this.content.scrollTo(this.disX *30,this.disZ*30)
  }

  




}