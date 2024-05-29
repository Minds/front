import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BehaviorSubject, Subject } from 'rxjs';
import { ToasterService } from '../../../common/services/toaster.service';
import { MockComponent, MockService } from '../../../utils/mock';
import { BoostModalV2Component } from './boost-modal-v2.component';
import { BoostableEntity, BoostModalPanel } from './boost-modal-v2.types';
import { BoostModalV2Service } from './services/boost-modal-v2.service';

describe('BoostModalV2Component', () => {
  let comp: BoostModalV2Component;
  let fixture: ComponentFixture<BoostModalV2Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        BoostModalV2Component,
        MockComponent({
          selector: 'm-boostModalV2__header',
        }),
        MockComponent({
          selector: 'm-boostModalV2__audienceSelector',
        }),
        MockComponent({
          selector: 'm-boostModalV2__budgetSelector',
        }),
        MockComponent({
          selector: 'm-boostModalV2__review',
        }),
        MockComponent({
          selector: 'm-boostModalV2__footer',
        }),
      ],
      providers: [
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
      ],
    })
      .overrideProvider(BoostModalV2Service, {
        useValue: MockService(BoostModalV2Service, {
          has: ['activePanel$', 'callSaveIntent$', 'entity$', 'firstPanel$'],
          props: {
            activePanel$: {
              get: () =>
                new BehaviorSubject<BoostModalPanel>(BoostModalPanel.REVIEW),
            },
            callSaveIntent$: { get: () => new Subject<boolean>() },
            entity$: {
              get: () =>
                new BehaviorSubject<BoostableEntity>({
                  guid: '123',
                  type: 'activity',
                  subtype: '',
                  owner_guid: '234',
                  time_created: '99999999999',
                }),
            },
            firstPanel$: {
              get: () =>
                new BehaviorSubject<BoostModalPanel>(BoostModalPanel.AUDIENCE),
            },
          },
        }),
      })
      .compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(BoostModalV2Component);
    comp = fixture.componentInstance;

    (comp as any).service.activePanel$.next(BoostModalPanel.REVIEW);
    (comp as any).service.firstPanel$.next(BoostModalPanel.AUDIENCE);

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

  it('should call save intent on ', () => {
    spyOn(comp, 'onSaveIntent');
    (comp as any).service.callSaveIntent$.next(true);
    expect(comp.onSaveIntent).toHaveBeenCalled();
  });

  it('should set modal data', (done: DoneFn) => {
    const entity: BoostableEntity = {
      guid: '234',
      type: 'activity',
      subtype: '',
      owner_guid: '234',
      time_created: '99999999999',
    };

    comp.setModalData({
      onDismissIntent: () => void 0,
      onSaveIntent: () => void 0,
      entity: entity,
    });

    (comp as any).service.entity$.subscribe((val) => {
      expect(val).toEqual(entity);
      done();
    });
  });

  it('should try set modal data and call to dismiss if entity is nsfw', () => {
    const entity: BoostableEntity = {
      guid: '234',
      type: 'activity',
      nsfw: [1],
      subtype: '',
      owner_guid: '234',
      time_created: '99999999999',
    };

    comp.setModalData({
      onDismissIntent: jasmine.createSpy(),
      onSaveIntent: () => void 0,
      entity: entity,
    });

    expect((comp as any).toast.error).toHaveBeenCalledWith(
      'NSFW content cannot be boosted.'
    );
    expect(comp.onDismissIntent).toHaveBeenCalled();
  });

  describe('firstPanel$', () => {
    it('should change active panel to first panel for GOAL panel', () => {
      comp.activePanel$.next(null);
      (comp as any).service.firstPanel$.next(BoostModalPanel.GOAL);
      expect(comp.activePanel$.getValue()).toBe(BoostModalPanel.GOAL);
    });

    it('should change active panel to first panel for BUDGET panel', () => {
      comp.activePanel$.next(null);
      (comp as any).service.firstPanel$.next(BoostModalPanel.BUDGET);
      expect(comp.activePanel$.getValue()).toBe(BoostModalPanel.BUDGET);
    });

    it('should NOT change active panel to first panel for AUDIENCE panel', () => {
      comp.activePanel$.next(BoostModalPanel.BUDGET);
      (comp as any).service.firstPanel$.next(BoostModalPanel.AUDIENCE);
      expect(comp.activePanel$.getValue()).toBe(BoostModalPanel.BUDGET);
    });
  });
});
