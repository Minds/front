import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'm-marketing--features',
  templateUrl: 'features.component.html'
})

export class MarketingFeaturesComponent {

  minds = window.Minds;

  @Input() panels = { 
    newsfeed: true
  };

  constructor(
  ) {

  }

}
