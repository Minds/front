import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AuthModalComponent } from './auth-modal.component';
import { SiteService } from '../../../common/services/site.service';
import { MockComponent, MockService } from '../../../utils/mock';
import { ConfigsService } from '../../../common/services/configs.service';

describe('AuthModalComponent', () => {
  let component: AuthModalComponent;
  let fixture: ComponentFixture<AuthModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          AuthModalComponent,
          MockComponent({
            selector: 'm-registerForm',
            inputs: [
              'showTitle',
              'showBigButton',
              'showLabels',
              'showPromotions',
              'showInlineErrors',
            ],
          }),
        ],
        providers: [
          { provide: SiteService, useValue: MockService(SiteService) },
          { provide: ConfigsService, useValue: MockService(ConfigsService) },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
