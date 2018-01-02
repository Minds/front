import { Component, Input } from '@angular/core';
import { Client } from '../../common/api/client.service';

import { FaqService } from './faq.service'; 

@Component({
  selector: 'm-faq--page',
  templateUrl: 'faq.page.html'
})

export class FaqPage {

  constructor(
    private client: Client,
    public service: FaqService,
  ) { }

  ngOnInit() {
  }

}
