import { ThemeService } from './../../common/services/theme.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ConfigsService } from './../../common/services/configs.service';
import { MetaService } from './../../common/services/meta.service';
import { Client } from './../../services/api/client';
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';

@Component({
  selector: 'm-embed',
  templateUrl: 'embed.component.html',
})
export class EmbedComponent implements OnInit {
  entity$: BehaviorSubject<any> = new BehaviorSubject(null);
  error$: BehaviorSubject<string> = new BehaviorSubject(null);
  paramsSubscription$: Subscription;
  queryParamsSubscription$: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private metaService: MetaService,
    private themeService: ThemeService,
    public client: Client
  ) {}

  ngOnInit() {
    this.themeService.setUp();

    this.paramsSubscription$ = this.activatedRoute.paramMap.subscribe(
      params => {
        const guid = params.get('guid');

        /**
         * Load entity and update metadata.
         * This request must ideally be run on the
         * server side and transferred to the client
         * */
        if (guid) {
          this.load(guid);
        }
      }
    );

    this.queryParamsSubscription$ = this.activatedRoute.queryParamMap.subscribe(
      params => {
        this.themeService.toggleTheme(params.get('theme') === 'dark');
      }
    );
  }

  load(guid: string) {
    this.client
      .get('api/v1/media/' + guid, { children: false })
      .then((response: any) => {
        if (response.entity.type !== 'object') {
          return;
        }

        if (response.entity) {
          this.entity$.next(response.entity);
          this.updateMeta();
        }
      })
      .catch(e => this.error$.next(e.message));
  }

  private updateMeta(): void {
    const entity = this.entity$.getValue();
    const title =
      entity.title || `${entity.ownerObj.username}'s ${entity.subtype}`;
    this.metaService.setTitle(title);
    this.metaService.setDescription(entity.description);
    this.metaService.setOgImage(entity.thumbnail_src);
  }

  public ngOnDestroy() {
    this.queryParamsSubscription$.unsubscribe();
    this.paramsSubscription$.unsubscribe();
  }
}
