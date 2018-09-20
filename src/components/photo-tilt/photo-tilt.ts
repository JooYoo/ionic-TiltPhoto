import { Component, Input, ViewChild, Renderer } from '@angular/core'
import { Platform, DomController, NavController } from 'ionic-angular'
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion';


@Component({
  selector: 'photo-tilt',
  templateUrl: 'photo-tilt.html',
  host: {
    '(window:deviceorientation)': 'onDeviceOrientation($event)',
    '(window:resize)': 'initTilt()'
  }
})
export class PhotoTiltComponent {

  @Input('tiltImage') tiltImage: any;
  @Input('tiltHeight') tiltHeight: any;

  @ViewChild('mask') mask: any;
  @ViewChild('image') image: any;

  averageGamma: any = [];
  maxTilt: number = 20;
  latestTilt: any = 0;
  centerOffset: any;
  resizedImageWidth: any;
  aspectRatio: any;
  delta: any;
  height: any;
  width: any;

  moveX: number = 0;
  originX: number = 0;

  id: any;
  x: number
  y: number
  z: number
  timeStamp: string

  constructor(public platform: Platform,
    public domCtrl: DomController,
    public renderer: Renderer,
    public navCtrl: NavController,
    public deviceMotion: DeviceMotion) {


  }

  initTilt() {

    this.height = this.tiltHeight || this.platform.height();
    this.width = this.platform.width();
    // 长宽比
    this.aspectRatio = this.image.nativeElement.width / this.image.nativeElement.height;
    this.renderTilt();

  }

  renderTilt() { // 没有这里‘手机倾斜视角动’就不起作用了

    this.image.nativeElement.height = this.height;

    this.resizedImageWidth = this.aspectRatio * this.image.nativeElement.height;
    this.renderer.setElementStyle(this.image.nativeElement, 'width', this.resizedImageWidth + 'px');

    this.delta = this.resizedImageWidth - this.width;
    // 中心偏移量；中心起点
    this.centerOffset = this.delta / 2;
    console.log("centerOffset:" + this.centerOffset)

    this.updatePosition();
  }

  startMotion() { // accelerater
    try {

      var option: DeviceMotionAccelerometerOptions = { frequency: 20000 };
      this.id = this.deviceMotion.watchAcceleration(option).subscribe((acc: DeviceMotionAccelerationData) => {
        this.x = acc.x
        this.y = acc.y
        this.z = acc.z
        this.timeStamp = "" + acc.timestamp
      })

    } catch (error) {
      alert("Error" + error)
    }
  }

  onDeviceOrientation(ev) { // 如果设备出现方向上的变化，这个函数就会被调用

    this.startMotion()

    console.log("x:" + this.x)
    // console.log("y:" + this.y)
    // console.log("z:" + this.z)

    if (this.averageGamma.length > 8) {
      this.averageGamma.shift();
    }
    // console.log("shift:" + this.averageGamma)

    // this.averageGamma.push(ev.gamma);
    // 求过去八次的平均值
    // this.latestTilt = this.averageGamma.reduce((previous, current) => {
    //   return previous + current;
    // }) / this.averageGamma.length;
    // console.log(this.latestTilt)

    this.averageGamma.push(this.x);
    // 求出了过去在x轴上的八次平均值
    this.latestTilt = this.averageGamma.reduce((previous, current) => {
      return previous + current;
    }) / this.averageGamma.length;
    // console.log("lastestTilt:" + this.latestTilt)


    this.domCtrl.write(() => {
      this.updatePosition();
    });

  }

  updatePosition() {

    let tilt = this.latestTilt;

    if (tilt > 0) {
      tilt = Math.min(tilt, this.maxTilt);
    } else {
      tilt = Math.max(tilt, this.maxTilt * -1);
    }

    let pxToMove = (tilt * this.centerOffset) / this.maxTilt;

    this.updateTiltImage((this.centerOffset + pxToMove) * -1);

  }

  updateTiltImage(pxToMove) {

    if (this.originX == 0 && !isNaN(pxToMove)) {
      this.originX = pxToMove
      console.log("I'm here!!!!!!")
    }

    if (!isNaN(pxToMove)) {
      console.log("pxToMove:" + pxToMove)
      console.log("originX:" + this.originX)
      console.log("moveX:" + this.moveX)
      console.log("------------------------------------------------")
      //this.moveX = pxToMove + 1 - pxToMove


      if (pxToMove > this.originX) {
        // go right
        this.moveX = 40
      }
      else if (pxToMove < this.originX) {
        //go left
        this.moveX= -40
      }



      this.originX = this.moveX + this.originX;
    }

    this.renderer.setElementStyle(this.image.nativeElement, 'transform', 'translate3d(' +  this.originX+ 'px,0,0)');

    // 使用陀螺仪来调整照片大小，以此来实现远近的效果
    //   this.renderer.setElementStyle(this.image.nativeElement, 'height',  -pxToMove+600 + 'px');
    //   this.renderer.setElementStyle(this.image.nativeElement, 'width',  -pxToMove+600 + 'px');
  }

}