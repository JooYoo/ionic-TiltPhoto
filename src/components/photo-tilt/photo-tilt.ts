import { Component, Input, ViewChild, Renderer } from '@angular/core'
import { Platform, DomController, NavController, Content } from 'ionic-angular'


@Component({
  selector: 'photo-tilt',
  templateUrl:'photo-tilt.html',
  host: {
    '(window:deviceorientation)': 'onDeviceOrientation($event)',
    '(window:resize)': 'ngOnInit()'
    // // 'initTilt()'
  }
})
export class PhotoTiltComponent {

  @Input('tiltImage') tiltImage: any;
  @Input('tiltHeight') tiltHeight: any;

  @ViewChild('mask') mask: any;
  @ViewChild('image')image: any;
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

  // zoomInX: number
  // zoomInY: number
  // zoomInOffset: number = 0.1
  // isStartPoint: boolean = true
  // startPointX: number
  // nextPointX: number
  // startPointY: number
  // nextPointY: number

  constructor(public platform: Platform,
    public domCtrl: DomController,
    public renderer: Renderer) {

    this.isActive = true

  }

  scrollToRight(){
    console.log('scrollTo: Hitted!!')
    this.content.scrollTo(900,0,1000);
  }
  scrollToMoreRight(){
    this.content.scrollTo(200,0,1000);
  }

  scrollToLeft(){
    console.log('scrollTo: Hitted!!')
    this.content.scrollTo(0,500,1000);
  }

  onDeviceOrientation(ev) { // 如果设备出现方向上的变化，这个函数就会被调用

    if (this.isActive) {

      if (this.averageGamma.length > 8) {
        this.averageGamma.shift();
      }

      this.averageGamma.push(ev.gamma);

      // console.log('averageGamma:'+ ev.gamma)

      // if(ev.gamma > 0){
      //   this.scrollToRight()
      // }
      // else{
      //   this.scrollToLeft()
      // }

     

      // 求过去八次的平均值
      this.latestTilt = this.averageGamma.reduce((previous, current) => {
        return previous + current;
      }) / this.averageGamma.length;

      this.domCtrl.write(() => {
        this.updatePosition();
      });
    }
  }

  mouseDown() {
    this.isActive = true;
    if (this.isActive) {
    //  console.log('isActive:' + 'onPress')
    }
  }


  mouseUp() { 
    this.isActive = false
    if (!this.isActive) {
      // console.log('isActive:' + 'onRelease')
    }
  }


  // initTilt
  ngOnInit() {

    console.log('in initTilt!!!!')

    this.height = this.tiltHeight || this.platform.height();
    this.width = this.platform.width();
    // 长宽比
    this.aspectRatio = this.image.nativeElement.width / this.image.nativeElement.height;

    // console.log('width:' + this.image.nativeElement.width)
    // console.log('cardWrapper:' + this.cardWrapper.nativeElement.width)


    this.renderTilt();

  }

  renderTilt() { // 没有这里‘手机倾斜视角动’就不起作用了

    this.image.nativeElement.height = this.height;

    this.resizedImageWidth = this.aspectRatio * this.image.nativeElement.height;
    this.renderer.setElementStyle(this.image.nativeElement, 'width', this.resizedImageWidth + 'px');

    this.delta = this.resizedImageWidth - this.width;
    // 中心偏移量；中心起点
    this.centerOffset = this.delta / 2;

    this.updatePosition();
  }

  // onPan(ev) {
  //   // catch the start point //then // get next point each time
  //   if (this.isStartPoint) {
  //     this.startPointY = ev.center.y
  //     this.zoomInY = 1
  //   }
  //   else {
  //     this.nextPointY = ev.center.y
  //   }

  //   if (this.startPointY > this.nextPointY) {
  //     this.zoomInY += this.zoomInOffset
  //   } else if (this.startPointY < this.nextPointY && !this.isStartPoint) {
  //     this.zoomInY -= this.zoomInOffset
  //   }

  //   this.isStartPoint = false

  //   console.log('--------------------------------')

  //   this.renderer.setElementStyle(this.image.nativeElement, 'transform','scale('+ this.zoomInY + ')');
  //   // this.renderer.setElementStyle(this.image.nativeElement, 'height', this.zoomInY + 'px');
    
  // }

 

  // click to active infinity
 
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

    this.renderer.setElementStyle(this.image.nativeElement, 'transform', 'translate3d(' + pxToMove + 'px,0,0)');
    
    let cleanNum = Math.round(pxToMove)
    this.content.scrollTo(-cleanNum,0,500);
    
    console.log('inEnd:' + cleanNum)
  }

}