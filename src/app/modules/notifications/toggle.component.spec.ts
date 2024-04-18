import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Session } from '../../services/session';
import { MockComponent, MockDirective, MockService } from '../../utils/mock';
import { NotificationService } from './notification.service';
import { NotificationsTopbarToggleComponent } from './toggle.component';
import { Storage } from '../../services/storage';
import { BehaviorSubject } from 'rxjs';

xdescribe('NotificationsTopbarToggleComponent', () => {
  let comp: NotificationsTopbarToggleComponent;
  let fixture: ComponentFixture<NotificationsTopbarToggleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        MockComponent({
          selector: 'm-notifications--flyout',
          inputs: ['hidden', 'visible'],
          outputs: ['close'],
        }),
        MockComponent({
          selector: 'm-tooltip',
        }),
        MockDirective({
          selector: 'm-tooltip--icon',
        }),
        NotificationsTopbarToggleComponent,
      ],
      providers: [
        {
          provide: Session,
          useValue: MockService(Session),
        },
        {
          provide: NotificationService,
          useValue: MockService(NotificationService, {
            has: ['count$'],
            props: {
              count$: {
                get: () => new BehaviorSubject<number>(0),
              },
            },
          }),
        },
        {
          provide: Router,
          useValue: MockService(Router),
        },
        {
          provide: Storage,
          useValue: MockService(Storage),
        },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(NotificationsTopbarToggleComponent);
    comp = fixture.componentInstance;
    comp.toggled = false;

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

  it('should toggle flyout', () => {
    comp.flyout = {
      toggleLoad: jasmine.createSpy('toggleLoad'),
    };

    expect(comp.toggled).toBeFalse();

    comp.toggle(null);

    expect(comp.flyout.toggleLoad).toHaveBeenCalled();
    expect(comp.toggled).toBeTrue();
  });

  it('should navigate to fullscreen notifications for user-agent indicating they are mobile', () => {
    comp.flyout = {
      toggleLoad: jasmine.createSpy('toggleLoad'),
    };

    spyOnProperty(window.navigator, 'userAgent').and.returnValue('android');
    expect(comp.toggled).toBeFalse();

    comp.toggle(null);

    expect(comp.flyout.toggleLoad).not.toHaveBeenCalled();
    expect(comp.toggled).toBeFalse();
    expect((comp as any).router.navigate).toHaveBeenCalledWith([
      '/notifications/v3',
    ]);
  });
});
