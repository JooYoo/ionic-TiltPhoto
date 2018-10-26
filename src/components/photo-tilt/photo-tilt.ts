import { Component, Renderer, ViewChild } from '@angular/core'
import { Platform, DomController, Content } from 'ionic-angular'
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion';


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

  rawDataPoolX: number[] = []
  rawDataPoolY: number[] = []
  rawDataPoolZ: number[] = []
  dataPoolX: number[] = []
  dataPoolY: number[] = []
  dataPoolZ: number[] = []
  poolIndexX: number = 0
  poolIndexY: number = 0
  poolIndexZ: number = 0
  resultsX: string[] = []
  resultsY: string[] = []
  resultsZ: string[] = []

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
  getDataPool(rawDataPool: number[], datePool: number[], poolIndex: number, result: string[]) {

    while (poolIndex != rawDataPool.length - 1) {

      if (poolIndex > rawDataPool.length - 1) {
        break
      }

      for (var i = 0; i < 3; i++) {
        datePool.push(rawDataPool[poolIndex])
        poolIndex++
      }

      this.checkTrend(datePool, result)
    }
  }

  checkTrend(sampleNumber: number[], results: string[]) {

    if (sampleNumber[1] > sampleNumber[0] && sampleNumber[2] > sampleNumber[1]
      || sampleNumber[0] == sampleNumber[1] && sampleNumber[2] > sampleNumber[1]) {
      results.push("大")
    }
    else if (sampleNumber[0] == sampleNumber[1] && sampleNumber[1] == sampleNumber[2] || sampleNumber[0] == sampleNumber[2]) {
      results.push("平")
    }
    else {
      results.push("小")
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

    // push acc DataPool
    this.rawDataPoolX.push(+Number(acceleration.x).toFixed(2))
    this.rawDataPoolY.push(+Number(acceleration.y).toFixed(2))
    this.rawDataPoolZ.push(+Number(acceleration.z).toFixed(2))
    //
    this.getDataPool(this.rawDataPoolX,this.dataPoolX, this.poolIndexX, this.resultsX)
    this.getDataPool(this.rawDataPoolY,this.dataPoolY, this.poolIndexY, this.resultsY)
    this.getDataPool(this.rawDataPoolZ,this.dataPoolZ, this.poolIndexZ, this.resultsZ)

    // scroll it
    this.toScroll()
  }


  // FIXME: use the Data in pool to scroll
  public toScroll(): void {
    //this.scroll._scrollContent.nativeElement.scrollTop = this.disZ
    this.content.scrollTo(0, this.disY * 100)
  }

}