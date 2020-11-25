import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { ChannelEditService } from '../../../channels/v2/edit/edit.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { Session } from '../../../../services/session';
import { MindsChannelResponse } from '../../../../interfaces/responses';
import { ApiService } from '../../../../common/api/api.service';
import { catchError, take } from 'rxjs/operators';
import { OnboardingV3Service } from '../../onboarding-v3.service';

/**
 * Channel editing component for onboarding v3.
 */
@Component({
  selector: 'm-onboardingV3__channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.ng.scss'],
  providers: [ChannelEditService],
})
export class OnboardingV3ChannelComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  /**
   * FormGroup
   */
  public form: FormGroup;

  /**
   * CDN URL
   */
  private cdnUrl: string;

  /**
   * Behaviour subject containing the avatar src as a string.
   */
  public avatarSrc$: BehaviorSubject<string> = new BehaviorSubject<string>(
    'none'
  );

  /**
   * Used in a similar way to inProgress$ but when true
   * the component can be shown even if init is not finished.
   */
  public preloading$ = new BehaviorSubject<boolean>(true);

  /**
   * Emitted to on next button clicked.
   */
  @Input() nextClicked$: BehaviorSubject<boolean>;

  constructor(
    private fb: FormBuilder,
    private session: Session,
    private configs: ConfigsService,
    private channelEditService: ChannelEditService,
    private onboarding: OnboardingV3Service,
    private api: ApiService
  ) {}

  async ngOnInit() {
    // get latest channel from API.
    const { channel } = await this.sync();

    // set channel service
    this.channelEditService.setChannel(channel);

    // init form
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

    // we can now show the component as form is initialized with values.
    this.preloading$.next(false);

    // set cdn url
    this.cdnUrl = this.configs.get('cdn_url');

    // setup subscriptions
    this.subscriptions.push(
      // save on next clicked
      this.nextClicked$.subscribe(clicked => {
        if (clicked) {
          this.save();
        }
      }),
      // set new avatar src on change
      this.channelEditService.avatar$.subscribe(avatar => {
        const channel = this.channelEditService.channel$.getValue();
        let src: string = '';

        if (avatar) {
          src = `url(${URL.createObjectURL(avatar)})`;
        } else if (channel && channel.icontime) {
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

  /**
   * Get users display name.
   * @returns { BehaviorSubject<string> } - users display name.
   */
  get name$(): BehaviorSubject<string> {
    return this.channelEditService.displayName$;
  }

  /**
   * Get users bio.
   * @returns { BehaviorSubject<string> } - users bio.
   */
  get bio$(): BehaviorSubject<string> {
    return this.channelEditService.bio$;
  }

  /**
   * Saves bio and display name using channel service.
   * @returns { Promise<void> } - awaitable.
   */
  public async save(): Promise<void> {
    this.channelEditService.bio$.next(this.form.get('bio').value);
    this.channelEditService.displayName$.next(this.form.get('name').value);
    await this.channelEditService.save();

    this.onboarding.strikeThrough('SetupChannelStep');
  }

  /**
   * Take first selected file and upload it.
   * @param fileInput: HTMLInputElement - input element
   * @returns { void }
   */
  public uploadAvatar(fileInput: HTMLInputElement): void {
    const file = fileInput.files.item(0);

    if (!file) {
      return;
    }

    this.channelEditService.avatar$.next(file);
    this.channelEditService.save();
  }

  /**
   * GET Minds channel from server.
   * @returns { Promise<MindsChannelResponse> } - awaitable object containing `channel` property.
   */
  async sync(): Promise<MindsChannelResponse> {
    return this.api
      .get(`api/v1/channel/${this.session.getLoggedInUser().username}`)
      .pipe(
        take(1),
        catchError((e: any) => {
          return of(null);
        })
      )
      .toPromise();
  }
}
