import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostConsoleStatsBarComponent } from './stats-bar.component';
import { ConfigsService } from '../../../../../../common/services/configs.service';
import { BoostModalLazyService } from '../../../../modal/boost-modal-lazy.service';
import { MockService } from '../../../../../../utils/mock';

describe('BoostConsoleStatsBarComponent', () => {
  let component: BoostConsoleStatsBarComponent;
  let fixture: ComponentFixture<BoostConsoleStatsBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoostConsoleStatsBarComponent],
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
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoostConsoleStatsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
