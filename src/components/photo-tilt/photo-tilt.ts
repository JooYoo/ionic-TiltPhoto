import { Component, Renderer, ViewChild } from '@angular/core'
import { Platform, DomController, Content } from 'ionic-angular'
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion';
import { ScrollType } from '../../app/Model/scrollType'

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

  scrollUnit: number = 5

  rawDataPoolX: number[] = []
  rawDataPoolY: number[] = []
  rawDataPoolZ: number[] = []
  dataPoolX: number[] = []
  dataPoolY: number[] = []
  dataPoolZ: number[] = []
  poolIndexX: number = 0
  poolIndexY: number = 0
  poolIndexZ: number = 0
  resultsX: ScrollType[] = []
  resultsY: ScrollType[] = []
  resultsZ: ScrollType[] = []

  subscription: any;
  subscription2: any;
  cards: number[] = []

  @ViewChild('content') content: Content;

  constructor(public platform: Platform,
    public domCtrl: DomController,
    public renderer: Renderer,
    public deviceMotion: DeviceMotion) {

    // generate Cards
    for (let index = 0; index < 50; index++) {
      this.cards.push(index)
    }

  }

  //TODO: result as enum
  getDataPool(rawDataPool: number[],
    datePool: number[],
    poolIndex: number,
    results: ScrollType[]) {

    while (poolIndex != rawDataPool.length - 1) {

      if (poolIndex > rawDataPool.length - 1) {
        break
      }

      for (var i = 0; i < 3; i++) {
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
    }
    else if (sampleNumber[0] == sampleNumber[1] && sampleNumber[1] == sampleNumber[2] || sampleNumber[0] == sampleNumber[2]) {
      results.push(ScrollType.stay)
    }
    else {
      results.push(ScrollType.negative)
    }
  }

  public startMonitor() {
    var option: DeviceMotionAccelerometerOptions = {
      frequency: 5
    };

    this.subscription = this.deviceMotion.watchAcceleration(option).
      subscribe((acceleration: DeviceMotionAccelerationData) => {
        this.accData = acceleration
        this.getherAccData(this.accData)
        // this.accTimeStamp = acceleration.timestamp
      });
  }

  public stopMonitor() {
    this.subscription.unsubscribe();
  }

  getherAccData(acceleration: any) {

    // push acc data to raw data pool
    this.rawDataPoolX.push(+Number(acceleration.x).toFixed(2))
    this.rawDataPoolY.push(+Number(acceleration.y).toFixed(2))
    this.rawDataPoolZ.push(+Number(acceleration.z).toFixed(2))

    // handle raw data to get "direction signal"
    this.getDataPool(this.rawDataPoolX, this.dataPoolX, this.poolIndexX, this.resultsX)
    this.getDataPool(this.rawDataPoolY, this.dataPoolY, this.poolIndexY, this.resultsY)
    this.getDataPool(this.rawDataPoolZ, this.dataPoolZ, this.poolIndexZ, this.resultsZ)

    // scroll 
    this.getScrollDirectionX(this.resultsX)
    //FIXME: getScrollDirectionX
    //this.getScrollDirectionX(this.resultsY)
  }

  // to scroll the content
  getScrollDirectionX(scrollActionsX: ScrollType[]): void {
    //this.scroll._scrollContent.nativeElement.scrollTop = this.disZ
    for (let i = 0; i < scrollActionsX.length; i++) {
      const oneMoveDirectionX = scrollActionsX[i];
      this.toScrollX(oneMoveDirectionX)
    }
  }
  toScrollX(oneMoveDirectionX: ScrollType) {
    if (oneMoveDirectionX == ScrollType.positive) {
      this.content.scrollTo(2, 0, 300)
    }
    else if (oneMoveDirectionX == ScrollType.negative) {
      this.content.scrollTo(-2, 0, 300)
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
      this.content.scrollTo(0, this.scrollUnit +=5, 300)
    }
    else if (oneMoveDirectionY == ScrollType.negative) {
      this.content.scrollTo(0, 2, 300)
    } else {
      console.log("Stay.")
    }
  }

  toScroll() {
    this.content.scrollTo(this.scrollUnit += 5, 0)
  }

}