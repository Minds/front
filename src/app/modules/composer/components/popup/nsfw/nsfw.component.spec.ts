import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { Supermind } from '../../../../supermind/supermind.types';
import { ComposerService } from '../../../services/composer.service';
import { SupermindComposerPayloadType } from '../supermind/superminds-creation.service';
import { NsfwComponent } from './nsfw.component';

describe('Composer NSFW Component', () => {
  let comp: NsfwComponent;
  let fixture: ComponentFixture<NsfwComponent>;

  const supermindRequestMock = {
    receiver_guid: '123',
    reply_type: 1,
    twitter_required: true,
    payment_options: {
      amount: 10,
      payment_type: 1,
    },
    terms_agreed: true,
    refund_policy_agreed: true,
  };

  const supermindReplyMock = {
    guid: '123',
    activity_guid: '321',
    sender_guid: '234',
    receiver_guid: '345',
    status: 1,
    payment_amount: 10,
    payment_method: 1,
    payment_txid: '0x0',
    created_timestamp: 123,
    updated_timestamp: 123,
    expiry_threshold: 123,
    twitter_required: false,
    reply_type: 1,
    entity: {},
    receiver_entity: {},
  };

  const composerServiceMock: any = MockService(ComposerService, {
    has: ['nsfw$', 'supermindRequest$', 'supermindReply$'],
    props: {
      nsfw$: { get: () => new BehaviorSubject<number[]>([]) },
      supermindRequest$: {
        get: () =>
          new BehaviorSubject<SupermindComposerPayloadType>(
            supermindRequestMock
          ),
      },
      supermindReply$: {
        get: () => new BehaviorSubject<Supermind>(supermindReplyMock),
      },
    },
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        NsfwComponent,
        MockComponent({
          selector: 'm-button',
          outputs: ['onAction'],
        }),
      ],
      providers: [
        {
          provide: ComposerService,
          useValue: composerServiceMock,
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(NsfwComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    (comp as any).service.nsfw$.next([]);
    (comp as any).service.supermindRequest$.next(supermindRequestMock);
    (comp as any).service.supermindReply$.next(supermindReplyMock);

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should save tags if there are tags and the post is NOT supermind content', () => {
    const nsfwState = [1, 2, 3];
    comp.state = nsfwState;
    (comp as any).service.supermindRequest$.next(null);
    (comp as any).service.supermindReply$.next(null);

    comp.save();

    expect((comp as any).service.nsfw$.getValue()).toEqual(nsfwState);
  });

  it('should save tags if there are NO tags and the post is IS supermind content', () => {
    const nsfwState = [];
    comp.state = nsfwState;

    comp.save();

    expect((comp as any).service.nsfw$.getValue()).toEqual(nsfwState);
  });

  it('should NOT save tags if there are tags and the post is IS supermind content', () => {
    const nsfwState = [1, 2, 3];
    comp.state = nsfwState;

    comp.save();

    expect((comp as any).toasterService.error).toHaveBeenCalledWith(
      'You may not create an NSFW supermind at this time.'
    );
    // should not have been called
    expect((comp as any).service.nsfw$.getValue()).toEqual([]);
  });
});
