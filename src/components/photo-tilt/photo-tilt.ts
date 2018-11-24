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

  gammaAverage: any = [];
  gammaLatestTilt: any = 0
  gammaMaxTilt: number = 20;

  betaAverage: any = []
  betaLatestTilt: any = 0
  betaMaxTilt: number = 20

  centerOffset: any;
  resizedImageWidth: any;
  aspectRatio: any;
  delta: any;
  height: any;
  width: any = 0;

  isActive: boolean;
  cards: number[] = []

  constructor(public platform: Platform,
    public domCtrl: DomController,
    public renderer: Renderer) {

    for (let i = 0; i < 150; i++) {
      this.cards.push(i)
    }

    this.isActive = false
  }

  //#region [1. initTilt]
  ngOnInit() {

    // this.height = this.tiltHeight || this.platform.height();
    this.height = this.platform.height();
    this.width = this.platform.width();
    // 长宽比
    this.aspectRatio = this.infinity.nativeElement.offsetWidth / this.infinity.nativeElement.offsetHeight;

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

    if (this.isActive) {

      //
      // Gamma：水平方向位移
      if (this.gammaAverage.length > 8) {
        this.gammaAverage.shift()
      }
      // Gamma: 收集水平位移量
      this.gammaAverage.push(ev.gamma)
      // Gamma：求过去八次的平均值
      this.gammaLatestTilt = this.gammaAverage.reduce((previous, current) => {
        return previous + current
      }) / this.gammaAverage.length


      //
      // Beta: 垂直方向位移
      if (this.betaAverage.length > 8) {
        this.betaAverage.shift();
      }
      // Beta: 收集垂直方向位移量
      this.betaAverage.push(ev.beta);
      // Beta: 求过去八次的平均值
      this.betaLatestTilt = this.betaAverage.reduce((previous, current) => {
        return previous + current
      }) / this.betaAverage.length

      this.domCtrl.write(() => {
        this.updatePosition();
      });
    }
  }
  //#endregion


  //#region [3. to scroll]
  gammaUpdatePosition(): number {
    let gammaTilt = this.gammaLatestTilt;
    // if (gammaTilt > 0) {
    //   gammaTilt = Math.min(gammaTilt, this.gammaMaxTilt);
    // } else {
    //   gammaTilt = Math.max(gammaTilt, this.gammaMaxTilt * -1);
    // }
    let gammaPxToMove = (gammaTilt * this.centerOffset) / this.gammaMaxTilt;
    let gammaToMove = (this.centerOffset + gammaPxToMove) * -1

    return gammaToMove
  }

  betaUpdatePosition(): number {
    let betaTilt = this.betaLatestTilt;

    // if (betaTilt > 0) {
    //   betaTilt = Math.min(betaTilt, this.betaMaxTilt)
    // } else {
    //   betaTilt = Math.min(betaTilt, this.betaMaxTilt * -1)
    // }
    let betaPxToMove = (betaTilt * this.centerOffset) / this.betaMaxTilt
    let betaToMove = (this.centerOffset + betaPxToMove) * -1
    


    return betaToMove
  }

  updatePosition() {
    let gammaToMove = this.gammaUpdatePosition()
    let betaToMove = this.betaUpdatePosition()

    this.scrollCountent(gammaToMove, betaToMove)
  }

  scrollCountent(gammaToMove, betaToMove) {
    let betaCleanNum = Math.round(-betaToMove / 8)
    let gammaCleanNum = Math.round(-gammaToMove / 8)

    this.content.scrollTo(gammaCleanNum, betaCleanNum, 0.005);
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