import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Navigation as NavigationService } from '../../services/navigation';
import { Session } from '../../services/session';
import { MindsTitle } from '../../services/ux/title';
import { Client } from '../../services/api';
import { LoginReferrerService } from '../../services/login-referrer.service';

@Component({
  selector: 'm-branding',
  templateUrl: 'branding.component.html'
})

export class BrandingComponent {

  minds = window.Minds;

  constructor(
    public client: Client,
    public title: MindsTitle,
  ) {
    this.title.setTitle('Branding');
  }

}
