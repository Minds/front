import { Injectable } from '@angular/core';
import { KeyVal, MindsUser } from '../../../../interfaces/entities';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../../../common/api/api.service';
import {
  buildFromV1ChannelProfile,
  buildKeyVal,
} from '../../social-profiles-meta';
import { ToasterService } from '../../../../common/services/toaster.service';

/**
 * Hold edit component state and interact with the API
 */
@Injectable()
export class ChannelEditService {
  /**
   * Channel subject, should be immutable; Used for display purposes
   */
  readonly channel$: BehaviorSubject<MindsUser> =
    new BehaviorSubject<MindsUser>(null);

  /**
   * Local banner
   */
  readonly banner$: BehaviorSubject<File> = new BehaviorSubject<File>(null);

  /**
   * Local avatar
   */
  readonly avatar$: BehaviorSubject<File> = new BehaviorSubject<File>(null);

  /**
   * Bio subject
   */
  readonly bio$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /**
   * Display name subject
   */
  readonly displayName$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  /**
   * Location subject
   */
  readonly location$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /**
   * Coordinates subject. As it's not public, null = unchanged.
   */
  readonly coordinates$: BehaviorSubject<string> = new BehaviorSubject<string>(
    null
  );

  /**
   * Date of birth subject
   */
  readonly dob$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  /**
   * Is date of birth public subject
   */
  readonly publicDob$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Hashtags list subject
   */
  readonly hashtags$: BehaviorSubject<Array<string>> = new BehaviorSubject<
    Array<string>
  >([]);

  /**
   * Social links subject
   */
  readonly socialLinks$: BehaviorSubject<Array<KeyVal>> = new BehaviorSubject<
    Array<KeyVal>
  >([]);

  /**
   * In Progress flag subject
   */
  readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Constructor
   * @param api
   */
  constructor(
    protected api: ApiService,
    private toast: ToasterService
  ) {}

  /**
   * Sets the state based on a channel
   * @param channel
   */
  setChannel(channel: MindsUser): ChannelEditService {
    this.channel$.next(channel);
    this.bio$.next(channel.briefdescription);
    this.displayName$.next(channel.name);
    this.location$.next(channel.city);
    this.coordinates$.next(null /* Unchanged */);
    this.dob$.next(channel.dob);
    this.publicDob$.next(Boolean(channel.public_dob));
    this.hashtags$.next(channel.tags);
    this.socialLinks$.next(
      buildFromV1ChannelProfile(channel.social_profiles || [])
    );

    return this;
  }

  /**
   * Pushes a hashtag onto the array
   * @param hashtag
   */
  addHashtag(hashtag: string): void {
    this.hashtags$.next([...this.hashtags$.getValue(), hashtag]);
  }

  /**
   * Removes a hashtag from the array
   * @param hashtag
   */
  removeHashtag(hashtag: string): void {
    this.hashtags$.next(
      this.hashtags$.getValue().filter((entry) => entry !== hashtag)
    );
  }

  /**
   * Adds a new social link to the array
   * @param url
   */
  addSocialLink(url: string): void {
    if (!url) {
      return;
    }

    this.socialLinks$.next([...this.socialLinks$.getValue(), buildKeyVal(url)]);
  }

  /**
   * Removes a social link from the array based on the specified index
   * @param index
   */
  removeSocialLink(index: number): void {
    const socialLinks = this.socialLinks$.getValue();
    socialLinks.splice(index, 1);
    this.socialLinks$.next([...socialLinks]);
  }

  /**
   * Saves to server
   */
  async save(): Promise<MindsUser> {
    this.inProgress$.next(true);

    try {
      const requests: Array<Promise<any>> = [];

      const data: Partial<MindsUser> = {
        briefdescription: this.bio$.getValue(),
        name: this.displayName$.getValue(),
        city: this.location$.getValue(),
        dob: this.dob$.getValue(),
        public_dob: this.publicDob$.getValue() ? 1 : 0,
        tags: this.hashtags$.getValue(),
        social_profiles: this.socialLinks$.getValue(),
      };

      if (this.coordinates$.getValue() !== null) {
        data['coordinates'] = this.coordinates$.getValue();
      }

      requests.push(this.api.post(`api/v1/channel/info`, data).toPromise());

      if (this.avatar$.getValue()) {
        requests.push(
          this.api
            .upload(
              'api/v1/channel/avatar',
              {
                file: this.avatar$.getValue(),
              },
              { upload: true }
            )
            .toPromise()
        );
      }

      if (this.banner$.getValue()) {
        requests.push(
          this.api
            .upload(
              'api/v1/channel/banner',
              {
                file: this.banner$.getValue(),
              },
              { upload: true }
            )
            .toPromise()
        );
      }

      await Promise.all(requests);

      const userUpdateResponse = await this.api
        .get(`api/v1/channel/${this.channel$.getValue().guid}`)
        .toPromise();

      this.inProgress$.next(false);

      return userUpdateResponse.channel;
    } catch (e) {
      this.toast.error(e.error.message ?? 'An unknown error has occurred.');
      console.warn('Edit Service', e);
      this.inProgress$.next(false);
      return null;
    }
  }
}
