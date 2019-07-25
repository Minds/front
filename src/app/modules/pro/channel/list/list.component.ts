import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { FeedsService } from "../../../../common/services/feeds.service";
import { ProService } from "../../pro.service";

@Component({
  selector: 'm-pro--channel-list',
  template: `
    <!-- TODO: i18n -->
    <h1>{{type | titlecase}}</h1>
    <div class="m-proChannelList__content">
      <i class="material-icons">keyboard_arrow_left</i>
      <ul class="m-proChannelListContent__list">
<!--        <li *ngFor="let entity of (feedsService.feed | async); let i = index">-->
          <!-- TODO: custom tile here -->
<!--        </li>-->
        <li>
          <video src="https://cdn-cinemr.minds.com/cinemr_com/943902545938489353/720.mp4"></video>
        </li>
        <li>
          <video src="https://cdn-cinemr.minds.com/cinemr_com/943902545938489353/720.mp4"></video>
        </li>
        <li>
          <video src="https://cdn-cinemr.minds.com/cinemr_com/943902545938489353/720.mp4"></video>
        </li>
        <li>
          <video src="https://cdn-cinemr.minds.com/cinemr_com/943902545938489353/720.mp4"></video>
        </li>
        <li>
          <video src="https://cdn-cinemr.minds.com/cinemr_com/943902545938489353/720.mp4"></video>
        </li>
        <li>
          <video src="https://cdn-cinemr.minds.com/cinemr_com/943902545938489353/720.mp4"></video>
        </li>
        <li>
          <video src="https://cdn-cinemr.minds.com/cinemr_com/943902545938489353/720.mp4"></video>
        </li>
        <li>
          <video src="https://cdn-cinemr.minds.com/cinemr_com/943902545938489353/720.mp4"></video>
        </li>

      </ul>
      <i class="material-icons">keyboard_arrow_right</i>
    </div>
    <!-- TODO: add infinite scroll or something to load more -->
  `
})

export class ProChannelListComponent implements OnInit {
  type: string;

  paramsSubscription: Subscription;

  constructor(
    public feedsService: FeedsService,
    private proService: ProService,
    private route: ActivatedRoute,
    private router: Router,
  ) {

    this.paramsSubscription = this.route.params.subscribe(params => {


      if (params['type']) {
        this.type = params['type'];
      }

      switch (this.type) {
        case 'videos':
          break;
        case 'images':
          break;
        case 'articles':
          break;
        case 'groups':
          break;
        default:

      }

      this.load();

    });
  }

  ngOnInit() {

  }

  async load(refresh: boolean = false) {
    if (!refresh) {
      return;
    }

    if (refresh) {
      this.feedsService.clear();
    }

    // this.detectChanges();

    try {

      this.feedsService
        .setEndpoint(`api/v2/feeds/container/${this.proService.currentChannel.guid}/${this.type}`)
        .setLimit(8)
        .fetch();

    } catch (e) {
      console.error('ProChannelListComponent.load', e);
    }

    // this.detectChanges();
  }

  loadNext() {
    this.feedsService.loadMore();
  }
}
