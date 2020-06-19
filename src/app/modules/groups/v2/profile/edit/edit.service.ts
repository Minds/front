import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MindsUser } from '../../../../../interfaces/entities';
import { ApiService } from '../../../../../common/api/api.service';

@Injectable()
export class GroupEditService {
  /**
   * Group subject, should be immutable; Used for display purposes
   */
  readonly group$: BehaviorSubject<MindsUser> = new BehaviorSubject<MindsUser>(
    null
  );

  /**
   * Local banner
   */
  readonly banner$: BehaviorSubject<File> = new BehaviorSubject<File>(null);

  /**
   * Local avatar
   */
  readonly avatar$: BehaviorSubject<File> = new BehaviorSubject<File>(null);

  /**
   * Name subject
   */
  readonly name$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /**
   * Description subject
   */
  readonly description$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  /**
   * Hashtags list subject
   */
  readonly hashtags$: BehaviorSubject<Array<string>> = new BehaviorSubject<
    Array<string>
  >([]);

  /**
   * Membership subject
   */
  readonly membership$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Default view subject
   */
  readonly defaultView$: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );

  /**
   * Moderated subject
   */
  readonly moderated$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  /**
   * Video Chat Enabled subject
   */
  readonly videoChatEnabled: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /**
   * In Progress flag subject
   */
  readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(protected api: ApiService) {}

  /**
   * Sets the state based on a channel
   * @param group
   */
  setGroup(group: any): GroupEditService {
    this.group$.next(group);
    this.description$.next(group.briefdescription);
    this.name$.next(group.name);
    this.moderated$.next(group.moderated);
    this.videoChatEnabled.next(!(<boolean>group.videoChatDisabled));
    this.defaultView$.next(group.default_view);
    this.membership$.next(group.membership);
    this.hashtags$.next(group.tags);

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
      this.hashtags$.getValue().filter(entry => entry !== hashtag)
    );
  }

  async save() {
    const requests: Array<Promise<any>> = [];
    const guid = this.group$.getValue().guid;

    let endpoint = `api/v1/groups/group`;

    if (this.group$.getValue().guid) {
      endpoint += `/${this.group$.getValue().guid}`;
    }

    const videoChat = this.videoChatEnabled.getValue();

    const data: Partial<any> = {
      briefdescription: this.description$.getValue(),
      name: this.name$.getValue(),
      tags: this.hashtags$.getValue(),
      moderated: this.moderated$.getValue(),
      videoChatDisabled: !videoChat,
      default_view: this.defaultView$.getValue(),
      membership: this.membership$.getValue(),
    };

    requests.push(this.api.post(endpoint, data).toPromise());

    if (this.avatar$.getValue()) {
      requests.push(
        this.api
          .upload(
            `api/v1/groups/group/${guid}/avatar`,
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
            `api/v1/groups/group/${guid}/banner`,
            {
              file: this.banner$.getValue(),
            },
            { upload: true }
          )
          .toPromise()
      );
    }

    await Promise.all(requests);

    const groupUpdateResponse = await this.api
      .get(`api/v1/groups/group/${guid}`)
      .toPromise();

    this.inProgress$.next(false);

    return groupUpdateResponse.group;
  }
}
