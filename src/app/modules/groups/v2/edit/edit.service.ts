import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../../../common/api/api.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { MindsGroup } from '../group.model';

/**
 * Hold edit modal component state and interact with the API
 */
@Injectable()
export class GroupEditService {
  baseEndpoint: string;
  /**
   * Group subject, should be immutable; Used for display purposes
   */
  readonly group$: BehaviorSubject<MindsGroup> = new BehaviorSubject<
    MindsGroup
  >(null);

  /**
   * Local banner
   */
  readonly banner$: BehaviorSubject<File> = new BehaviorSubject<File>(null);

  /**
   * Local avatar
   */
  readonly avatar$: BehaviorSubject<File> = new BehaviorSubject<File>(null);

  /**
   * Description subject -- ojm change to description
   */
  readonly description$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  /**
   * Display name subject
   */
  readonly displayName$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

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
  constructor(protected api: ApiService, private toast: ToasterService) {}

  /**
   * Sets the state based on a group
   * @param group
   */
  setGroup(group: MindsGroup): GroupEditService {
    this.group$.next(group);
    this.description$.next(group.briefdescription);
    this.displayName$.next(group.name);

    this.baseEndpoint = `api/v1/groups/group/${group.guid}`;
    return this;
  }

  /**
   * Saves to server
   */
  async save(): Promise<MindsGroup> {
    this.inProgress$.next(true);

    try {
      const requests: Array<Promise<any>> = [];

      const data: Partial<MindsGroup> = {
        briefdescription: this.description$.getValue(),
        name: this.displayName$.getValue(),
      };

      requests.push(this.api.post(this.baseEndpoint, data).toPromise());

      if (this.avatar$.getValue()) {
        requests.push(
          this.api
            .upload(
              `${this.baseEndpoint}/avatar`,
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
              `${this.baseEndpoint}/banner`,
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
        .get(this.baseEndpoint)
        .toPromise();

      this.inProgress$.next(false);

      return groupUpdateResponse.group;
    } catch (e) {
      this.toast.error(e.error.message ?? 'An unknown error has occurred.');
      console.warn('Group Edit Service', e);
      this.inProgress$.next(false);
      return null;
    }
  }
}
