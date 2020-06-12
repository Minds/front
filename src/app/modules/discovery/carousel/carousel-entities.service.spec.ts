import { CarouselEntitiesService } from './carousel-entities.service';
import { clientMock } from '../../../../tests/client-mock.spec';
import { MockService } from '../../../utils/mock';
import { ConfigsService } from '../../../common/services/configs.service';
import { GroupsService } from '../../groups/groups.service';
import { BehaviorSubject } from 'rxjs';
import { fakeAsync } from '@angular/core/testing';

describe('CarouselEntitiesService', () => {
  const user1 = {
    guid: '1',
    entity: {
      guid: '1',
      type: 'user',
      name: 'user1',
      username: 'user1',
      icontime: null,
      subscribed: false,
    },
  };
  const user2 = {
    guid: '2',
    entity: {
      guid: '2',
      type: 'user',
      name: 'user2',
      username: 'user2',
      icontime: null,
      subscribed: false,
    },
  };
  const user3 = {
    guid: '3',
    entity: {
      guid: '3',
      type: 'user',
      name: 'user3',
      username: 'user3',
      icontime: null,
      subscribed: false,
    },
  };
  const user4 = {
    guid: '4',
    entity: {
      guid: '4',
      type: 'user',
      name: 'user4',
      username: 'user4',
      icontime: null,
      subscribed: false,
    },
  };

  const channels$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([
    user1,
    user2,
    user3,
    user4,
  ]);

  const group1 = {
    guid: '1',
    entity: {
      guid: '1',
      type: 'group',
      name: 'group1',
      icontime: '999',
      'is:member': false,
    },
  };
  const group2 = {
    guid: '2',
    entity: {
      guid: '2',
      type: 'group',
      name: 'group2',
      icontime: '999',
      'is:member': false,
    },
  };
  const group3 = {
    guid: '3',
    entity: {
      guid: '3',
      type: 'group',
      name: 'group3',
      icontime: '999',
      'is:member': false,
    },
  };
  const group4 = {
    guid: '4',
    entity: {
      guid: '4',
      type: 'group',
      name: 'group4',
      icontime: '999',
      'is:member': false,
    },
  };

  const groups$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([
    group1,
    group2,
    group3,
    group4,
  ]);

  let service: CarouselEntitiesService;

  const groupsServiceMock: any = MockService(GroupsService);
  const configsServiceMock: any = MockService(ConfigsService);

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();
    // clientMock.response['api/v1/subscribe/1'] = { status: 'success' };

    service = new CarouselEntitiesService(
      configsServiceMock,
      groupsServiceMock,
      clientMock
    );

    (service as any).client.response = {};
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
  });

  it('should set entities to groups', () => {
    service.setEntities(groups$);
    expect(service.entities$).toEqual(groups$);
  });

  it('should set entities when channels', () => {
    service.setEntities(channels$);
    expect(service.entities$).toEqual(channels$);
  });

  it('should call to join a group', () => {
    group1.entity['is:member'] = false;
    service.joinGroup(group1.entity);
    expect((service as any).groupsService.join).toHaveBeenCalled();
  });

  it('should call to leave a group ', () => {
    group1.entity['is:member'] = true;
    service.leaveGroup(group1.entity);
    expect((service as any).groupsService.leave).toHaveBeenCalled();
  });

  it('should call to subscribe to a channel', () =>
    fakeAsync(() => {
      const url = 'api/v1/subscribe/1';

      (service as any).client.response[url] = {
        status: 'success',
      };

      user1.entity.subscribed = false;
      service.subscribe(user1.entity);

      expect((service as any).client.post).toHaveBeenCalled();
      expect((service as any).client.post.calls.mostRecent().args[0]).toEqual(
        url
      );
    }));

  it('should call to unsubscribe from a channel', fakeAsync(() => {
    const url = 'api/v1/subscribe/1';

    (service as any).client.response[url] = {
      status: 'success',
    };

    user1.entity.subscribed = true;
    service.unsubscribe(user1.entity);

    expect((service as any).client.delete).toHaveBeenCalled();
    expect((service as any).client.delete.calls.mostRecent().args[0]).toEqual(
      url
    );
  }));
});
