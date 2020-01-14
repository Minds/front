import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Navigation as NavigationService } from '../../../services/navigation';
import { PagesService } from '../../services/pages.service';

@Component({
  selector: 'm-footer',
  templateUrl: 'footer.component.html',
})
export class FooterComponent {
  constructor(
    public navigation: NavigationService,
    public pagesService: PagesService
  ) {}
}
