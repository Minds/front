import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from '../../../utils/mock';
import { CarouselComponent } from './carousel.component';
import { CarouselEntitiesService } from './carousel-entities.service';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { clientMock } from '../../../../tests/client-mock.spec';
import { Client } from '../../../services/api';
import { ConfigsService } from '../../services/configs.service';

describe('CarouselComponent', () => {
  let comp: CarouselComponent;
  let fixture: ComponentFixture<CarouselComponent>;

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
      declarations: [CarouselComponent],
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
    fixture = TestBed.createComponent(CarouselComponent);
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
});
