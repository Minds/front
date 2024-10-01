import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Session } from '../../services/session';
import { ActivityService } from '../../common/services/activity.service';
import { MockService } from '../../utils/mock';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';

describe('AdminComponent', () => {
  let comp: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [AdminComponent],
      providers: [
        { provide: Session, useValue: MockService(Session) },
        {
          provide: ActivatedRoute,
          useValue: MockService(ActivatedRoute, {
            has: ['params'],
            props: {
              params: { get: () => new BehaviorSubject({}) },
            },
          }),
        },
        { provide: Router, useValue: MockService(Router) },
        { provide: ActivityService, useValue: MockService(ActivityService) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should navigate to home if user is not admin', () => {
      (comp as any).session.isAdmin.and.returnValue(false);
      comp.ngOnInit();
      expect((comp as any).router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should set filter from route params', () => {
      (comp as any).session.isAdmin.and.returnValue(true);
      (comp as any).route.params.next({ filter: 'interactions' });
      comp.ngOnInit();
      expect(comp.filter).toBe('interactions');
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from params subscription', () => {
      const unsubscribeSpy = jasmine.createSpy('unsubscribe');
      (comp as any).paramsSubscription = { unsubscribe: unsubscribeSpy };
      comp.ngOnDestroy();
      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });
});
