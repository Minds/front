import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BuildYourAlgorithmNoticeComponent } from './build-your-algorithm-notice.component';
import { Router } from '@angular/router';
import { ModalService } from '../../../../services/ux/modal.service';
import { CompassService } from '../../../compass/compass.service';
import { FeedNoticeService } from '../../services/feed-notice.service';
import { MockComponent, MockService } from '../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';

describe('BuildYourAlgorithmNoticeComponent', () => {
  let comp: BuildYourAlgorithmNoticeComponent;
  let fixture: ComponentFixture<BuildYourAlgorithmNoticeComponent>;

  let routerMock = { navigate: jasmine.createSpy('navigate') };

  const answersProvided$ = new BehaviorSubject<any>(null);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [
          BuildYourAlgorithmNoticeComponent,
          MockComponent({
            selector: 'm-feedNotice',
            inputs: ['icon'],
            outputs: ['dismissClick'],
          }),
          MockComponent({
            selector: 'm-button',
            inputs: ['color', 'solid', 'size'],
            outputs: ['onAction'],
          }),
        ],
        providers: [
          {
            provide: Router,
            useValue: routerMock,
          },
          {
            provide: ModalService,
            useValue: MockService(ModalService),
          },
          {
            provide: CompassService,
            useValue: MockService(CompassService, {
              has: ['answersProvided$'],
              props: {
                answersProvided$: { get: () => answersProvided$ },
              },
            }),
          },
          {
            provide: FeedNoticeService,
            useValue: MockService(FeedNoticeService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(BuildYourAlgorithmNoticeComponent);
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

  it('should dismiss on answers provided', () => {
    answersProvided$.next(true);
    expect((comp as any).modalService.dismissAll).toHaveBeenCalled();
    expect((comp as any).feedNotice.dismiss).toHaveBeenCalledWith(
      'build-your-algorithm'
    );
  });

  it('should present modal on primary option click', () => {
    comp.onPrimaryOptionClick(null);
    expect((comp as any).modalService.present).toHaveBeenCalled();
  });

  it('should navigate to blog on secondary option click', () => {
    comp.onSecondaryOptionClick(null);
    expect((comp as any).router.navigate).toHaveBeenCalledWith([
      '/minds/blog/build-your-algorithm-phase-1-1317916094152839188',
    ]);
  });

  it('should dismiss notice on dismiss function call', () => {
    comp.dismiss();
    expect((comp as any).feedNotice.dismiss).toHaveBeenCalledWith(
      'build-your-algorithm'
    );
  });
});
