import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminConsoleBoostsComponent } from './boosts.component';
import { MockComponent, MockService } from '../../../../../../utils/mock';
import { BoostConsoleService } from '../../../../../boost/console-v2/services/console.service';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('NetworkAdminConsoleBoostsComponent', () => {
  let comp: NetworkAdminConsoleBoostsComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleBoostsComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent({
          selector: 'm-boostConsole__list',
          inputs: ['showFilterBar'],
        }),
        NetworkAdminConsoleBoostsComponent,
      ],
      providers: [
        {
          provide: BoostConsoleService,
          useValue: MockService(BoostConsoleService, {
            has: ['adminContext$'],
            props: {
              adminContext$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
      ],
    });

    fixture = TestBed.createComponent(NetworkAdminConsoleBoostsComponent);
    comp = fixture.componentInstance;

    (comp as any).boostConsoleService.adminContext$.next(false);

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

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should set admin context on init', () => {
    (comp as any).boostConsoleService.adminContext$.next(false);

    comp.ngOnInit();

    expect(
      (comp as any).boostConsoleService.adminContext$.getValue()
    ).toBeTrue();
  });

  it('should render boost console list', () => {
    const boostConsoleList: DebugElement = fixture.debugElement.query(
      By.css('m-boostConsole__list')
    );

    expect(boostConsoleList).toBeTruthy();
    expect(boostConsoleList.componentInstance.showFilterBar).toBe(false);
  });
});
