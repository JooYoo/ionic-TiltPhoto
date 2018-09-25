import { Component } from '@angular/core';

/**
 * Generated class for the FlipcardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'flipcard',
  templateUrl: 'flipcard.html'
})
export class FlipcardComponent {

  text: string;

  constructor() {
    console.log('Hello FlipcardComponent Component');
    this.text = 'flipcard works';
  }

}
