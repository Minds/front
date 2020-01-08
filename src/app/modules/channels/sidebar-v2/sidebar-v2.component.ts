import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MindsUser } from '../../../interfaces/entities';
import { Session } from '../../../services/session';
import { Tag } from '../../hashtags/types/tag';
import { Client } from '../../../services/api/client';

@Component({
  selector: 'm-channel__sidebarv2',
  template: `
    <div class="m-channelSidebar__buttons">
      <button class="m-channelSidebar__message" i18n>
        <i class="material-icons">sentiment_satisfied_alt</i>
        <span>Message</span>
      </button>

      <button class="m-channelSidebar__pay" i18n>
        <i class="material-icons">sentiment_satisfied_alt</i>
        <span>Pay</span>
      </button>
    </div>

    <div class="m-channelSidebar__stats">
      <!--      <a-->
      <!--        [routerLink]="['/', user.username, 'feed']"-->
      <!--        class="mdl-tabs__tab mdl-color-text&#45;&#45;blue-grey-500"-->
      <!--        *ngIf="user.activity_count"-->
      <!--      >-->
      <!--        <span i18n="Count of activities@@M__COMMON__FEED_COUNT">Feed</span>-->
      <!--        <b>{{user.activity_count | number}}</b>-->
      <!--      </a>-->
      <a
        *ngIf="
          user.supporters_count && session.getLoggedInUser().guid != user.guid
        "
      >
        <span class="m-channelSidebarStats__title" i18n>
          Followers
        </span>
        <span class="m-channelSidebarStats__count">{{
          user.supporters_count | abbr
        }}</span>
      </a>
      <a
        [routerLink]="['/', user.username, 'supporters']"
        *ngIf="
          user.supporters_count && session.getLoggedInUser().guid == user.guid
        "
      >
        <span class="m-channelSidebarStats__title" i18n>
          Followers
        </span>
        <span class="m-channelSidebarStats__count">{{
          user.supporters_count | abbr
        }}</span>
      </a>
      <a [routerLink]="['/', user.username, 'subscribers']">
        <span class="m-channelSidebarStats__title" i18n>
          Following
        </span>
        <span class="m-channelSidebarStats__count">{{
          user.subscribers_count | abbr
        }}</span>
      </a>
      <a>
        <span class="m-channelSidebarStats__title" i18n>
          Views
        </span>
        <span class="m-channelSidebarStats__count">{{
          user.impressions | abbr
        }}</span>
      </a>
    </div>

    <div class="m-channelSidebar__bioFields">
      <!--      [ngClass]="{'m-channelSidebar__bioFields&#45;&#45;flex': !editing}"-->
      <!-- City / Location -->
      <div
        class="m-channelSidebar__bioField m-channelSidebar__city"
        [hidden]="editing || !user.city"
      >
        <i class="material-icons">location_on</i>
        <span>{{ user.city }}</span>
      </div>

      <div
        class="m-channel-bio-editor m-channel-city-editor"
        *ngIf="editing && isOwner()"
      >
        <div class="m-channel-bio-input m-channel-city-input">
          <i class="material-icons">location_on</i>
          <input
            (keyup)="findCity(user.city)"
            name="city"
            [(ngModel)]="user.city"
            class=""
            placeholder="Enter your city..."
            i18n-placeholder="@@M__COMMON__ENTER_CITY"
          />
        </div>
        <div
          class="m-discovery-cities mdl-card m-border"
          *ngIf="editing && cities.length > 0"
        >
          <p i18n="@@M__COMMON__SELECT_CITY">
            Select your city:
          </p>
          <li
            (click)="setCity(c)"
            *ngFor="let c of cities"
            [hidden]="!(c.address.town || c.address.city)"
          >
            {{ c.address.town }}{{ c.address.city }}, {{ c.address.state }}
          </li>
        </div>
      </div>
      <!-- END City / Location -->

      <!--      <div-->
      <!--        class="m-channelSidebar__bioField"-->
      <!--        *ngIf="user.tags && !editing"-->
      <!--      >-->
      <!--        <div-->
      <!--          class="m-channelSidebar__bioField__tags-container"-->
      <!--          [hidden]="editing || !user.tags"-->
      <!--        >-->
      <!--          <i class="material-icons">local_offer</i>-->
      <!--          <span *ngFor="let tag of user.tags">#{{tag}}</span>-->
      <!--        </div>-->
      <!--      </div>-->

      <!--      <div-->
      <!--        class="m-channel-bio-editor m-channel-city-editor"-->
      <!--        *ngIf="editing && isOwner()"-->
      <!--      >-->
      <!--        <div class="m-channel-bio-input">-->
      <!--          <i class="material-icons">local_offer</i>-->
      <!--          <m-hashtags-selector-->
      <!--            #hashtagsSelector-->
      <!--            [alignLeft]="true"-->
      <!--            [tags]="user.tags"-->
      <!--            (tagsChange)="onTagsChange($event)"-->
      <!--            (tagsAdded)="onTagsAdded($event)"-->
      <!--            (tagsRemoved)="onTagsRemoved($event)"-->
      <!--          >-->
      <!--          </m-hashtags-selector>-->
      <!--        </div>-->
      <!--        <div-->
      <!--          class="mdl-card mdl-shadow&#45;&#45;2dp"-->
      <!--          style="min-height:0;"-->
      <!--          *ngIf="errorMessage"-->
      <!--        >-->
      <!--          <div class="mdl-card__supporting-text">-->
      <!--            {{errorMessage}}-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->

      <!--      <m-channel&#45;&#45;social-profiles-->
      <!--        [user]="user"-->
      <!--        [editing]="editing && isOwner()"-->
      <!--        (changed)="setSocialProfile($event)"-->
      <!--      ></m-channel&#45;&#45;social-profiles>-->
    </div>
  `,
})
export class ChannelSidebarV2Component implements OnInit {
  minds = window.Minds;

  @Input() user: MindsUser;
  @Input() editing: boolean = false;
  @Output() changeEditing = new EventEmitter<boolean>();
  searching;
  errorMessage: string = '';
  amountOfTags: number = 0;

  tooManyTags: boolean = false;

  // @todo make a re-usable city selection module to avoid duplication here
  cities: Array<any> = [];

  constructor(public client: Client, public session: Session) {}

  ngOnInit() {}

  isOwner() {
    return this.session.getLoggedInUser().guid === this.user.guid;
  }

  findCity(q: string) {
    if (this.searching) {
      clearTimeout(this.searching);
    }
    this.searching = setTimeout(() => {
      this.client
        .get('api/v1/geolocation/list', { q: q })
        .then((response: any) => {
          this.cities = response.results;
        });
    }, 100);
  }

  setCity(row: any) {
    this.cities = [];
    if (row.address.city) {
      this.user.city = row.address.city;
    }
    if (row.address.town) {
      this.user.city = row.address.town;
    }
    if (window.Minds) {
      window.Minds.user.city = this.user.city;
    }
    this.client.post('api/v1/channel/info', {
      coordinates: row.lat + ',' + row.lon,
      city: window.Minds.user.city,
    });
  }

  onTagsChange(tags: string[]) {
    this.amountOfTags = tags.length;
    if (this.amountOfTags > 5) {
      this.errorMessage = 'You can only select up to 5 hashtags';
      this.tooManyTags = true;
    } else {
      this.tooManyTags = false;
      this.user.tags = tags;
      if (this.errorMessage === 'You can only select up to 5 hashtags') {
        this.errorMessage = '';
      }
    }
  }

  onTagsAdded(tags: Tag[]) {}

  onTagsRemoved(tags: Tag[]) {}

  setSocialProfile(value: any) {
    this.user.social_profiles = value;
  }
}
