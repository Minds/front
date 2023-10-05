import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import {
  InteractionType,
  InteractionsModalDataService,
} from './interactions-modal-data.service';
import { InteractionsModalComponent } from './interactions-modal.component';
import { MockComponent, MockService } from '../../../utils/mock';

describe('InteractionsModalComponent', () => {
  let comp: InteractionsModalComponent;
  let fixture: ComponentFixture<InteractionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        InteractionsModalComponent,
        MockComponent({
          selector: 'm-publisherCard',
          inputs: ['publisher'],
        }),
        MockComponent({
          selector: 'm-newsfeed__entity',
          inputs: ['entity'],
        }),
        MockComponent({
          selector: 'infinite-scroll',
          inputs: ['moreData', 'inProgress', 'hidden', 'scrollSource'],
          outputs: ['load'],
        }),
        MockComponent({
          selector: 'm-modalCloseButton',
        }),
      ],
    })
      .overrideProvider(InteractionsModalDataService, {
        useValue: MockService(InteractionsModalDataService, {
          has: [
            'nextPagingToken$',
            'inProgress$',
            'list$',
            'entityGuid$',
            'type$',
          ],
          props: {
            nextPagingToken$: { get: () => new BehaviorSubject<string>('1') },
            inProgress$: { get: () => new BehaviorSubject<boolean>(false) },
            list$: { get: () => new BehaviorSubject<any[]>([]) },
            entityGuid$: {
              get: () => new BehaviorSubject<string>('1234567890123456'),
            },
            type$: {
              get: () => new BehaviorSubject<InteractionType>('votes-up'),
            },
          },
        }),
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractionsModalComponent);
    comp = fixture.componentInstance;

    comp.type = 'votes-up';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('title', () => {
    it('should get title for votes up', () => {
      comp.type = 'votes-up';
      expect(comp.title).toBe('Upvotes');
    });

    it('should get title for reminds', () => {
      comp.type = 'reminds';
      expect(comp.title).toBe('Reminds');
    });

    it('should get title for quotes', () => {
      comp.type = 'quotes';
      expect(comp.title).toBe('Quote posts');
    });

    it('should get title for subscribers', () => {
      comp.type = 'subscribers';
      expect(comp.title).toBe('Recent subscribers');
    });

    it('should get title for mutual-subscribers', () => {
      comp.type = 'mutual-subscribers';
      expect(comp.title).toBe('Subscribers you know');
    });
  });
});
