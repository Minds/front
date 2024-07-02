import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent, MockService } from '../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { Injector } from '@angular/core';
import { ComposerBoostService } from '../../../composer/services/boost.service';
import { ComposerModalService } from '../../../composer/components/modal/modal.service';
import { CreateBoostNoticeComponent } from './create-boost-notice.component';
import { BehaviorSubject } from 'rxjs';

describe('CreateBoostNoticeComponent', () => {
  let comp: CreateBoostNoticeComponent;
  let fixture: ComponentFixture<CreateBoostNoticeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        CreateBoostNoticeComponent,
        MockComponent({
          selector: 'm-feedNotice',
          inputs: ['icon', 'dismissible'],
          template: `<ng-content></ng-content>`,
        }),
        MockComponent({
          selector: 'm-button',
          inputs: ['color', 'solid', 'size'],
          outputs: ['onAction'],
        }),
      ],
      providers: [
        {
          provide: ComposerModalService,
          useValue: MockService(ComposerModalService),
        },
        {
          provide: ComposerBoostService,
          useValue: MockService(ComposerBoostService, {
            has: ['isBoostMode$'],
            props: {
              isBoostMode$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
        Injector,
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(CreateBoostNoticeComponent);
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

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should handle primary option click', () => {
    (comp as any).composerBoostService.isBoostMode$.next(false);
    (comp as any).composerModalService.setInjector.and.returnValue(
      (comp as any).composerModalService
    );
    comp.onPrimaryOptionClick();

    expect((comp as any).composerBoostService.isBoostMode$.getValue()).toBe(
      true
    );
    expect((comp as any).composerModalService.setInjector).toHaveBeenCalled();
    expect((comp as any).composerModalService.present).toHaveBeenCalled();
  });
});
