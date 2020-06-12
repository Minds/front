import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from '../../../utils/mock';
import { DiscoveryCarouselComponent } from './carousel.component';
import { CarouselEntitiesService } from './carousel-entities.service';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { clientMock } from '../../../../tests/client-mock.spec';
import { Client } from '../../../services/api';
import { ConfigsService } from '../../../common/services/configs.service';

describe('DiscoveryCarouselComponent', () => {
  let comp: DiscoveryCarouselComponent;
  let fixture: ComponentFixture<DiscoveryCarouselComponent>;

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

  const channels$: BehaviorSubject<any> = new BehaviorSubject<any[]>([
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

  const groups$: BehaviorSubject<any> = new BehaviorSubject<any[]>([
    group1,
    group2,
    group3,
    group4,
  ]);

  const carouselEntitiesService: any = MockService(CarouselEntitiesService, {
    has: ['entites$'],
    props: {
      entities$: { get: () => channels$ },
    },
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [DiscoveryCarouselComponent],
      providers: [
        {
          provide: CarouselEntitiesService,
          useValue: carouselEntitiesService,
        },
        {
          provide: Client,
          useValue: clientMock,
        },
        {
          provide: ConfigsService,
          useValue: MockService(ConfigsService),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    fixture = TestBed.createComponent(DiscoveryCarouselComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should get the entities from the CarouselEntitiesService when set', () => {
    carouselEntitiesService.entities$ = channels$;
    expect(comp.entities$).toBe(channels$);
  });

  it('should get position of elements in the carousel', () => {
    carouselEntitiesService.entities$ = channels$;
    (comp as any).getCarouselPositions();

    // DOM does not render as expected in our runner
    expect((comp as any).carouselPositions).toEqual([
      [8, 777],
      [8, 777],
      [8, 777],
      [8, 777],
    ]);
    expect((comp as any).halfContainerWidth).toBe(384.5);
  });

  it('should go to next index on carousel', () => {
    carouselEntitiesService.entities$ = channels$;
    expect((comp as any).currentItemIndex).toBe(0);
    comp.goCarousel('next');

    expect((comp as any).currentItemIndex).toBe(1);
  });

  it('should get background image style object for a channel', () => {
    (comp as any).cdnUrl = 'https://www.minds.com/';
    expect(comp.getStyle(user1.entity)).toEqual({
      'background-image': 'url(https://www.minds.com/icon/1)',
    });
  });

  it('should get background image style object for a group', () => {
    (comp as any).cdnUrl = 'https://www.minds.com/';
    expect(comp.getStyle(group1.entity)).toEqual({
      'background-image':
        'url(https://www.minds.com/fs/v1/avatars/1/medium/999)',
    });
  });

  it('should get the name of a channel', () => {
    expect(comp.getName(user1.entity)).toBe('@user1');
  });

  it('should get the name of a group', () => {
    expect(comp.getName(group1.entity)).toBe('group1');
  });

  it('should get the redirect link for a channel', () => {
    expect(comp.getLink(user1.entity)).toBe('/user1');
  });

  it('should get the redirect link for a channel', () => {
    expect(comp.getLink(group1.entity)).toBe('/groups/profile/1');
  });

  it('should get the correct button text for a channel when not subscribed', () => {
    expect(comp.getButtonText(user1.entity)).toBe('Subscribe');
  });

  it('should get the correct button text for a channel when subscribed', () => {
    user1.entity.subscribed = true;
    expect(comp.getButtonText(user1.entity)).toBe('Subscribed');
  });

  it('should make call to subscribe when user is not subscribed', () => {
    user1.entity.subscribed = false;
    comp.onButtonClick(user1.entity);
    expect(
      (comp as any).carouselEntitiesService.subscribeToChannel
    ).toHaveBeenCalled();
  });

  it('should make call to unsubscribe when user is subscribed', () => {
    user1.entity.subscribed = true;
    fixture.detectChanges();
    comp.onButtonClick(user1.entity);
    expect(
      (comp as any).carouselEntitiesService.unsubscribeFromChannel
    ).toHaveBeenCalled();
  });

  it('should get the correct button text for a group when not a member', () => {
    expect(comp.getButtonText(group1.entity)).toBe('Join');
  });

  it('should get the correct button text for a group when a member', () => {
    group1.entity['is:member'] = true;
    expect(comp.getButtonText(group1.entity)).toBe('Joined');
  });

  it('should make call to join when user is not a member of a group ', () => {
    group1.entity['is:member'] = false;
    comp.onButtonClick(group1.entity);
    expect((comp as any).carouselEntitiesService.joinGroup).toHaveBeenCalled();
  });

  it('should make call to leave when user is a member of a group ', () => {
    group1.entity['is:member'] = true;
    comp.onButtonClick(group1.entity);
    expect((comp as any).carouselEntitiesService.leaveGroup).toHaveBeenCalled();
  });
});
