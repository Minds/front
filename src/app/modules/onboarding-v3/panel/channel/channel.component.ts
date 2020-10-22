import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ChannelEditService } from '../../../channels/v2/edit/edit.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { Session } from '../../../../services/session';

@Component({
  selector: 'm-onboardingV3__channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.ng.scss'],
  providers: [ChannelEditService],
})
export class OnboardingV3ChannelComponent implements OnInit, OnDestroy {
  form: FormGroup;
  cdnUrl: string;
  avatarSrc$: BehaviorSubject<string> = new BehaviorSubject<string>('none');
  subscriptions: Subscription[] = [];

  @Input() nextClicked$: BehaviorSubject<boolean>;

  constructor(
    private fb: FormBuilder,
    private session: Session,
    private configs: ConfigsService,
    private channelEditService: ChannelEditService
  ) {}

  ngOnInit() {
    this.channelEditService.setChannel(this.session.getLoggedInUser());

    this.form = this.fb.group({
      name: [
        this.name$.getValue(),
        [Validators.required, Validators.maxLength(256)],
      ],
      bio: [
        this.bio$.getValue(),
        [Validators.required, Validators.maxLength(2048)],
      ],
      avatar: ['', Validators.required],
    });

    this.cdnUrl = this.configs.get('cdn_url');

    this.subscriptions.push(
      this.nextClicked$.subscribe(clicked => {
        if (clicked) {
          this.save();
        }
      }),
      this.channelEditService.avatar$.subscribe(avatar => {
        const channel = this.channelEditService.channel$.getValue();
        let src: string = '';

        if (avatar) {
          src = `url(${URL.createObjectURL(avatar)})`;
        } else if (channel.icontime) {
          src = `url(${this.cdnUrl}icon/${(channel as any).guid}/large/${
            (channel as any).icontime
          })`;
        } else {
          src = 'none';
        }

        this.avatarSrc$.next(src);
      })
    );
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  get name$(): BehaviorSubject<string> {
    return this.channelEditService.displayName$;
  }

  get bio$(): BehaviorSubject<string> {
    return this.channelEditService.bio$;
  }

  public async save(): Promise<void> {
    console.log('saving....');
    this.channelEditService.bio$.next(this.form.get('bio').value);
    this.channelEditService.displayName$.next(this.form.get('name').value);
    await this.channelEditService.save();
  }

  public uploadAvatar(fileInput: HTMLInputElement) {
    const file = fileInput.files.item(0);

    if (!file) {
      return;
    }

    this.channelEditService.avatar$.next(file);
    this.channelEditService.save();
  }
}
