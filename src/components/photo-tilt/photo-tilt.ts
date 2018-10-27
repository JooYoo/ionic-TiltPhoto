import { Component, Renderer, ViewChild } from '@angular/core'
import { Platform, DomController, Content } from 'ionic-angular'
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion';
import { ScrollType } from '../../app/Model/scrollType'
import { DeviceOrientation, DeviceOrientationCompassHeading, DeviceOrientationCompassOptions } from '@ionic-native/device-orientation';

@Component({
  selector: 'photo-tilt',
  templateUrl: 'photo-tilt.html',
})
export class PhotoTiltComponent {

  counter: number = 0

  lastAccData: any = 0
  accData: any
  accTimeStamp: any
  disX: any
  disY: any
  disZ: any

  scrollUnitX: number = 0
  scrollUnitY: number = 0

  rawDataPoolX: number[] = []
  rawDataPoolY: number[] = []
  rawDataPoolZ: number[] = []
  dataPoolX: number[] = []
  dataPoolY: number[] = []
  dataPoolZ: number[] = []
  poolIndexX: number = 0
  poolIndexY: number = 0
  poolIndexZ: number = 0
  scrollActionsX: ScrollType[] = []
  resultsY: ScrollType[] = []
  resultsZ: ScrollType[] = []
  iScrollActionX: number = 0
  iScrollActionY: number = 0

  subscription: any;
  subscription2: any;
  orienValue: any
  headingAccuracy: any
  magneticHeading: any
  trueHeading: any
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

  }


  getDataPool(rawDataPool: number[],
    datePool: number[],
    poolIndex: number,
    results: ScrollType[]) {

    while (poolIndex != rawDataPool.length - 1) {

      if (poolIndex > rawDataPool.length - 1) {
        break
      }

      for (var i = 0; i < 3; i++) {
        console.log(rawDataPool[poolIndex] * 100)
        datePool.push(rawDataPool[poolIndex])
        poolIndex++
      }

      this.checkTrend(datePool, results)
    }
  }

  checkTrend(sampleNumber: number[], results: ScrollType[]) {


    if (sampleNumber[1] > sampleNumber[0] && sampleNumber[2] > sampleNumber[1]
      || sampleNumber[0] == sampleNumber[1] && sampleNumber[2] > sampleNumber[1]) {
      results.push(ScrollType.positive)
      console.log("right")
    }
    else if (sampleNumber[0] == sampleNumber[1] && sampleNumber[1] == sampleNumber[2] || sampleNumber[0] == sampleNumber[2]) {
      results.push(ScrollType.stay)
      console.log("stay")
    }
    else {
      results.push(ScrollType.negative)
      console.log("left")
    }


  }

  public startMonitor() {
    var option: DeviceMotionAccelerometerOptions = {
      frequency: 5
    };

    this.subscription = this.deviceMotion.watchAcceleration(option).
      subscribe((acceleration: DeviceMotionAccelerationData) => {
        this.accData = acceleration
        //this.getherAccData(acceleration)
      });

    var option2: DeviceOrientationCompassOptions = {
      frequency: 400
    };

    this.subscription2 = this.deviceOrientation.watchHeading().subscribe(
      (data: DeviceOrientationCompassHeading) => {
        this.headingAccuracy = Math.round(data.headingAccuracy)
        this.magneticHeading = Math.round(data.magneticHeading)
        this.trueHeading = data.trueHeading
        this.getherAccData(this.trueHeading)
      }
    )
  }
  public stopMonitor() {
    this.subscription.unsubscribe();
  }


  getherAccData(trueHeading: any) {

    if (this.counter % 2 == 0) {
      this.rawDataPoolX[0] = +Number(trueHeading).toFixed(3)
    } else {
      this.rawDataPoolX[1] = +Number(trueHeading).toFixed(3)
    }
    this.counter++

    if (this.rawDataPoolX[0] < this.rawDataPoolX[1]) {
      this.moveXNegative()
      console.log("left----")
    }
    else if (this.rawDataPoolX[0] > this.rawDataPoolX[1]) {
      this.moveXPositive()
      console.log("----right")

    }

  }

  moveXPositive() {
    this.content.scrollTo(this.scrollUnitX += 100.001, 0, 10)
  }
  moveXNegative() {
    this.content.scrollTo(this.scrollUnitX -= 100.001, 0, 10)
  }


  //#region scroll the content
  getScrollDirectionX(scrollActionsX: ScrollType[]): void {
    //TODO: try while effects


    for (let i = 0; i < scrollActionsX.length; i++) {
      const oneMoveDirectionX = scrollActionsX[i];
      this.toScrollX(oneMoveDirectionX)
    }

    // this.iScrollActionX ++;
  }
  toScrollX(oneMoveDirectionX: ScrollType) {
    // console.log(oneMoveDirectionX)
    if (oneMoveDirectionX == ScrollType.positive) {
      this.content.scrollTo(this.scrollUnitX += 5, 0, 0)

    }
    else if (oneMoveDirectionX == ScrollType.negative) {
      this.content.scrollTo(this.scrollUnitX -= 5, 0, 0)

    } else {
      console.log("Stay.")
    }
  }

  // FIXME: x y need to be change at same time
  getScrollDirectionY(scrollActionsY: ScrollType[]): void {
    //this.scroll._scrollContent.nativeElement.scrollTop = this.disZ
    for (let i = 0; i < scrollActionsY.length; i++) {
      const oneMoveDirectionY = scrollActionsY[i];
      this.toScrollY(oneMoveDirectionY)
    }
  }
  toScrollY(oneMoveDirectionY: ScrollType) {
    if (oneMoveDirectionY == ScrollType.positive) {
      this.content.scrollTo(0, this.scrollUnitY += 5, 300)
    }
    else if (oneMoveDirectionY == ScrollType.negative) {
      this.content.scrollTo(0, this.scrollUnitY -= 5, 300)
    } else {
      console.log("Stay")
    }
  }
  //#endregion

  //TODO: delete here
  toScrollRight() {
    this.content.scrollTo(this.scrollUnitX += 50, 0, 400)
  }
  toScrollLeft() {
    this.content.scrollTo(this.scrollUnitX -= 50, 0, 400)
  }


}