import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { ConfigsService } from '../../../common/services/configs.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { Session } from '../../../services/session';
import { MockComponent, MockService } from '../../../utils/mock';
import { BoostModalComponent } from './boost-modal.component';
import { BoostModalService } from './boost-modal.service';

describe('BoostModalComponent', () => {
  let comp: BoostModalComponent;
  let fixture: ComponentFixture<BoostModalComponent>;

  const entity$ = new BehaviorSubject<any>({});
  const cashRefundPolicy$ = new BehaviorSubject<boolean>(false);
  const activeTab$ = new BehaviorSubject<string>('cash');

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [],
        declarations: [
          BoostModalComponent,
          MockComponent({
            selector: 'm-boostModal__tabs',
          }),
          MockComponent({
            selector: 'm-button',
            inputs: ['disabled', 'saving', 'size', 'color'],
          }),
          MockComponent({
            selector: 'm-modalCloseButton',
            inputs: ['color'],
          }),
        ],
        providers: [
          {
            provide: BoostModalService,
            useValue: MockService(BoostModalService, {
              has: ['entity$', 'activeTab$', 'cashRefundPolicy$'],
              props: {
                entity$: { get: () => entity$ },
                activeTab$: { get: () => activeTab$ },
                cashRefundPolicy$: { get: () => cashRefundPolicy$ },
              },
            }),
          },
          {
            provide: Session,
            useValue: sessionMock,
          },
          {
            provide: ToasterService,
            useValue: MockService(ToasterService),
          },
          {
            provide: ConfigsService,
            useValue: MockService(ConfigsService, {
              get: () => {
                // cdn_assets_url
                return '';
              },
            }),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(BoostModalComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    (comp as any).toast.error.calls.reset();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should be instantiated', () => {
    expect(comp).toBeTruthy();
  });

  it('should error if trying to boost nsfw content', () => {
    entity$.next({
      nsfw: [1, 2, 3],
      nsfw_lock: [],
    });
    comp.ngOnInit();

    expect((comp as any).toast.error).toHaveBeenCalledWith(
      'NSFW content cannot be boosted.'
    );
  });

  it('should error if trying to boost nsfw_locked content', () => {
    entity$.next({
      nsfw: [],
      nsfw_lock: [1, 2, 3],
    });
    comp.ngOnInit();

    expect((comp as any).toast.error).toHaveBeenCalledWith(
      'NSFW content cannot be boosted.'
    );
  });

  it('should NOT error if trying to boost NOT nsfw or nsfw_locked content', () => {
    entity$.next({
      nsfw: [],
      nsfw_lock: [],
    });

    comp.ngOnInit();

    expect((comp as any).toast.error).not.toHaveBeenCalledWith(
      'NSFW content cannot be boosted.'
    );
  });

  it('should call to reset on destroy', () => {
    comp.ngOnDestroy();
    expect((comp as any).service.reset).toHaveBeenCalled();
  });

  it('should submit a boost', async () => {
    expect(comp.inProgress$.getValue()).toBeFalsy();
    (comp as any).service.submitBoostAsync.and.returnValue({
      status: 'success',
    });

    cashRefundPolicy$.next(true);

    await comp.submitBoost();

    expect((comp as any).toast.success).toHaveBeenCalledWith(
      'Success! Your boost request is being processed.'
    );
  });

  it('should set inProgress to false and not show success if request to boost fails', async () => {
    expect(comp.inProgress$.getValue()).toBeFalsy();
    (comp as any).service.submitBoostAsync.and.throwError('Error!');

    await comp.submitBoost();

    expect(comp.inProgress$.getValue()).toBeFalsy();
    expect((comp as any).toast.success).not.toHaveBeenCalledWith(
      'Success! Your boost request is being processed.'
    );
  });
});
