import { Component, Input, ViewChild, Renderer } from '@angular/core'
import { Platform, DomController, Content } from 'ionic-angular'


@Component({
  selector: 'photo-tilt',
  templateUrl: 'photo-tilt.html',
  host: {
    '(window:deviceorientation)': 'onDeviceOrientation($event)',
    '(window:resize)': 'ngOnInit()'
    // // 'initTilt()'
  }
})
export class PhotoTiltComponent {
  
  @ViewChild('infinity') infinity: any;
  @ViewChild('content') content: Content;
  
  averageGamma: any = [];
  maxTilt: number = 20;
  latestTilt: any = 0;
  centerOffset: any;
  resizedImageWidth: any;
  aspectRatio: any;
  delta: any;
  height: any;
  width: any = 0;
  
  isActive: boolean;
  cards:number[]=[]

  constructor(public platform: Platform,
    public domCtrl: DomController,
    public renderer: Renderer) {

   for (let i = 0; i < 50; i++) {
    this.cards.push(i)
   }

    this.isActive = false
  }

  //#region [1. initTilt]
  ngOnInit() {
    console.log('in initTilt!!!!')

    // this.height = this.tiltHeight || this.platform.height();
    this.height = this.platform.height();
    this.width = this.platform.width();
    // 长宽比
    this.aspectRatio = this.infinity.nativeElement.offsetWidth / this.infinity.nativeElement.offsetHeight;

    console.log('width:' + this.infinity.nativeElement.offsetWidth)
    console.log('aspectRatio:' + this.aspectRatio)

    this.renderTilt();
  }
  renderTilt() { // 没有这里‘手机倾斜视角动’就不起作用了

    this.infinity.nativeElement.height = this.height;

    this.resizedImageWidth = this.aspectRatio * this.infinity.nativeElement.offsetHeight;
    this.renderer.setElementStyle(this.infinity.nativeElement, 'width', this.resizedImageWidth + 'px');

    this.delta = this.resizedImageWidth - this.width;
    // 中心偏移量；中心起点
    this.centerOffset = this.delta / 2;

    this.updatePosition();
  }
  //#endregion


  //#region [2. get sensor Data]
  onDeviceOrientation(ev) { // 如果设备出现方向上的变化，这个函数就会被调用
    //TODO: [temp] if (this.isActive)
    if (true) {

      if (this.averageGamma.length > 8) {
        this.averageGamma.shift();
      }

      this.averageGamma.push(ev.gamma);

      // 求过去八次的平均值
      this.latestTilt = this.averageGamma.reduce((previous, current) => {
        return previous + current;
      }) / this.averageGamma.length;

      this.domCtrl.write(() => {
        this.updatePosition();
      });
    }
  }
  //#endregion


  //#region [3. to scroll]
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

    let cleanNum = Math.round(-pxToMove / 8)
    this.content.scrollTo(cleanNum, 0, 0.005);

    console.log('inEnd:' + cleanNum)
  }
  //#endregion


  //#region [0. Hold to active scroll]
  mouseDown() {
    this.isActive = true;
    if (this.isActive) {
    }
  }
  mouseUp() {
    this.isActive = false
    if (!this.isActive) {
    }
  }
  //#endregion

}