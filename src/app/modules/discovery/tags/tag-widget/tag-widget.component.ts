import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { RegexService } from '../../../../common/services/regex.service';
import { DiscoveryTag, DiscoveryTagsService } from '../tags.service';

/**
 * Allows user to add or remove a hashtag from their tag list.
 *
 * Appears at top of feed when the search query contains a single hashtag
 * and the user isn't already following that tag
 */
@Component({
  selector: 'm-discovery__tagWidget',
  templateUrl: './tag-widget.component.html',
  styleUrls: ['./tag-widget.component.ng.scss'],
})
export class DiscoveryTagWidgetComponent implements OnInit, OnDestroy {
  querySubscription: Subscription;

  tagRegex: RegExp = new RegExp(this.regexService.getRegex('hash'));
  tag: string = '';
  alreadySubscribed: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private service: DiscoveryTagsService,
    private regexService: RegexService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  async load() {
    if (!this.service.trending$.value.length) {
      await this.service.loadTags();
    }

    this.querySubscription = this.route.queryParamMap.subscribe(
      (params: ParamMap) => {
        console.log('ojm query', params.get('q'));
        this.parseQuery(params.get('q'));
      }
    );
  }

  parseQuery(q: string): void {
    if (q) {
      const matchArr = q.match(this.tagRegex);

      console.log('ojm matchArr', matchArr[0]);
      if (matchArr && matchArr.length === 1) {
        this.tag = matchArr[0]
          .trim()
          .toLowerCase()
          .substring(1);

        this.alreadySubscribed = this.service.tags$.value.some(
          t => t.value === this.tag
        );

        console.log('ojm alreadySubscribed', this.tag, this.alreadySubscribed);

        return;
      }
    }

    this.tag = '';
    return;
  }

  ngOnDestroy() {
    if (this.querySubscription) this.querySubscription.unsubscribe();
  }
}
