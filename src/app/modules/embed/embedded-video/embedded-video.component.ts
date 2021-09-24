import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'm-embedded-video',
  templateUrl: 'embedded-video.component.html',
  styleUrls: ['embedded-video.component.ng.scss'],
})
export class EmbeddedVideoComponent implements OnInit {
  @Input()
  entity: any; // TODO: type
  queryParamsSubscription$: Subscription;
  autoplay$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  topVisible$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.queryParamsSubscription$ = this.activatedRoute.queryParamMap.subscribe(
      params => {
        // FIXME: this doesn't work because the browser doesn't let us play
        // if the user hasn't interacted with the document first
        this.autoplay$.next(params.get('autoplay') === 'true' || false);
      }
    );
  }

  onControlsShown() {
    this.topVisible$.next(true);
  }

  onControlsHidden() {
    this.topVisible$.next(false);
  }
}
