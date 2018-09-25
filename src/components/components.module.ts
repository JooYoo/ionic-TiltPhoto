import { NgModule } from '@angular/core';
import { PhotoTiltComponent } from './photo-tilt/photo-tilt';
import { FlipcardComponent } from './flipcard/flipcard';
@NgModule({
	declarations: [PhotoTiltComponent,
    FlipcardComponent],
	imports: [],
	exports: [PhotoTiltComponent,
    FlipcardComponent]
})
export class ComponentsModule {}
