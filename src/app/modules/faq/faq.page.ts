import { Component, OnInit, ViewChild } from '@angular/core';
import { Client } from '../../common/api/client.service';

import { FaqService } from './faq.service';
import { MindsTitle } from '../../services/ux/title';
import { ActivatedRoute, Router } from '@angular/router';
import { FaqComponent } from './faq.component';

@Component({
  selector: 'm-faq--page',
  templateUrl: 'faq.page.html'
})

export class FaqPage implements OnInit {

  @ViewChild(FaqComponent) faq: FaqComponent;
  category: string = 'all';
  inProgress: boolean = false;

  constructor(private client: Client,
              public service: FaqService,
              public title: MindsTitle,
              public route: ActivatedRoute,
              public router: Router) {
    this.title.setTitle('FAQ');
  }

  ngOnInit() {
    const categoryParam = this.route.snapshot.params.category;
    if (categoryParam) {
      this.inProgress = true;
      this.service.get(categoryParam).then((faq) => {
        if (faq.length === 0) {
          this.router.navigate(['/faq']);
        } else {
          this.category = categoryParam;

          this.faq._category = this.category;
        }
      });
    }
  }

  ngAfterViewInit() {
    if (!this.inProgress) {
      this.faq._category = this.category;
    }
  }

}
