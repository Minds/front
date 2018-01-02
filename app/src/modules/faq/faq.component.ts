import { Component, Input } from '@angular/core';
import { Client } from '../../common/api/client.service';

import { FaqService } from './faq.service'; 

@Component({
  selector: 'm-faq',
  templateUrl: 'faq.component.html'
})

export class FaqComponent {

  @Input() category = 'all';
  faq$;

  constructor(
    private client: Client,
    public service: FaqService,
  ) { }

  ngOnInit() {
    this.faq$ = this.service.get(this.category);
  }

  goTo(category: string, i: number) {
    const fragment = `faq-${category}--${i}`;

    const element = document.querySelector('#' + fragment)
    if (element) {
      setTimeout(() => {
        let top = element.getBoundingClientRect().top + window.scrollY - 60;
        window.scrollTo(0, top); // Adjust scrolling with a negative value here
      }, 25);
    }
  }

}
