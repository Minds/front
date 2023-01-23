import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BoostRejectionModalService } from './services/boost-rejection-modal.service';
import { Boost, BoostLocation, BoostState } from '../../../boost.types';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { BoostConsoleService } from '../../services/console.service';
import { MockService } from '../../../../../utils/mock';
import { BoostRejectionModalComponent } from './boost-rejection-modal.component';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { BoostAudience } from '../../../modal-v2/boost-modal-v2.types';
import { of } from 'rxjs';

describe('BoostRejectionModalComponent', () => {
  let comp: BoostRejectionModalComponent;
  let fixture: ComponentFixture<BoostRejectionModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BoostRejectionModalComponent],
        providers: [
          {
            provide: ConfigsService,
            useValue: {
              get: () => {
                return {
                  rejection_reasons: [
                    {
                      code: 1,
                      label: '',
                    },
                  ],
                };
              },
            },
          },
          {
            provide: BoostConsoleService,
            useValue: {
              reject: jasmine.createSpy('reject').and.returnValue(of({})),
            },
          },
          {
            provide: ToasterService,
            useValue: MockService(ToasterService),
          },
        ],
      })
        .overrideProvider(BoostRejectionModalService, {
          useValue: MockService(BoostRejectionModalService, {
            has: ['boost'],
            props: {
              boost: {
                guid: '123',
                urn: '',
                owner_guid: '',
                entity_guid: '',
                entity: {},
                target_location: BoostLocation.NEWSFEED,
                target_suitability: BoostAudience.SAFE,
                payment_method: 123,
                payment_amount: 1,
                daily_bid: 1,
                duration_days: 1,
                boost_status: BoostState.PENDING,
                created_timestamp: 123,
                updated_timestamp: 123,
                approved_timestamp: 123,
                rejection_reason: null,
              },
            },
          }),
        })
        .compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(BoostRejectionModalComponent);
    comp = fixture.componentInstance;

    comp['boost'] = {
      guid: '123',
      urn: '',
      owner_guid: '',
      entity_guid: '',
      entity: {},
      target_location: BoostLocation.NEWSFEED,
      target_suitability: BoostAudience.SAFE,
      payment_method: 123,
      payment_amount: 1,
      daily_bid: 1,
      duration_days: 1,
      boost_status: BoostState.PENDING,
      created_timestamp: 123,
      updated_timestamp: 123,
      approved_timestamp: 123,
      rejection_reason: null,
    };

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

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should call reject intent on ', () => {
    // spyOn(comp['boostConsoleService'], 'reject');
    comp.onRejectIntent();
    expect(comp['boostConsoleService'].reject).toHaveBeenCalled();
  });

  it('should set modal data', (done: DoneFn) => {
    const boost: Boost = {
      guid: '234',
      urn: '',
      owner_guid: '',
      entity_guid: '',
      entity: {},
      target_location: BoostLocation.NEWSFEED,
      target_suitability: BoostAudience.SAFE,
      payment_method: 123,
      payment_amount: 1,
      daily_bid: 1,
      duration_days: 1,
      boost_status: BoostState.PENDING,
      created_timestamp: 123,
      updated_timestamp: 123,
      approved_timestamp: 123,
      rejection_reason: null,
    };

    comp.setModalData({
      onCloseIntent: () => void 0,
      boost: boost,
    });

    expect(comp['boost']).toEqual(boost);
    done();
  });
});
