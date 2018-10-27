import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PhotoTiltComponent } from '../components/photo-tilt/photo-tilt';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { FlipcardComponent } from '../components/flipcard/flipcard';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PhotoTiltComponent,
    FlipcardComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DeviceMotion,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
