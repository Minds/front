import { Component, Input, OnInit } from '@angular/core';
import { TopbarHashtagsService } from "../../../hashtags/service/topbar.service";

type Hashtag = {
  value: string, selected: boolean
};

@Component({
  selector: 'm-onboarding--topics',
  template: `
    <div class="m-channelOnboarding__slide">
      <h2>What topics are you most interested in?</h2>

      <ul class="m-channelOnboardingSlideSection__list">
        <div class="mdl-spinner mdl-js-spinner is-active" [mdl] [hidden]="!inProgress"></div>

        <li class="m-channelOnboardingSlideSection__item"
            [ngClass]="{ 'm-channelOnboardingSlideSection__item--selected': hashtag.selected }"
            *ngFor="let hashtag of hashtags"
          >
          <span [ngClass]="{ 'selected': hashtag.selected }"
                (click)="toggleSelection(hashtag)">#{{hashtag.value}}</span>
        </li>
        <li class="m-hashtag--creator" *ngIf="!inProgress">
          <input
            type="text"
            name="hashtag"
            [(ngModel)]="input"
            (keyup)="keyUp($event)"
            #hashtagInput/>
          <i class="material-icons m-hashtag--creator--done"
             (click)="addNew()"
          >
            done
          </i>
          <i class="material-icons m-hashtag--creator--close"
             (click)="input = ''; addingHashtag = false; hashtagInput.focus()"
          >
            close
          </i>
        </li>
      </ul>
    </div>
  `
})

export class TopicsOnboardingComponent implements OnInit {
  static items = ['suggested_hashtags'];
  static canSkip: boolean = true;
  @Input() pendingItems: Array<string>;

  input: string = '';
  addingHashtag: boolean = false;
  hashtags: Array<Hashtag> = [];
  error: string;
  inProgress: boolean;

  constructor(
      private service: TopbarHashtagsService,
  ) {
  }

  ngOnInit() {
    this.load();
  }

  async load() {
    this.inProgress = true;

    try {
      this.hashtags = await this.service.load(50);
    } catch (e) {
      console.error(e);
    }

    this.inProgress = false;
  }

  async toggleSelection(hashtag) {
    try {
      await this.service.toggleSelection(hashtag, this);
    } catch (e) {
      this.error = (e && e.message) || 'Sorry, something went wrong';
      hashtag.selected = !hashtag.selected;
    }
  }


  async addNew() {
    this.addingHashtag = true;
    let hashtag: Hashtag = {
      value: this.service.cleanupHashtag(this.input.toLowerCase()),
      selected: false,
    };
    this.hashtags.push(hashtag);
    await this.toggleSelection(hashtag);
    this.input = ''; // clear input
    this.addingHashtag = false;
  }


  keyUp(e) {
    switch (e.keyCode) {
      case 32: //space
      case 9: //tab
      case 13: //enter
      case 188: //comma
        this.addNew();
        break;
    }
  }

}
