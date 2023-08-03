import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostConsoleFeedComponent } from './feed.component';
import { BoostConsoleService } from '../services/console.service';
import { MockService } from '../../../../utils/mock';
import { FeedsService } from '../../../../common/services/feeds.service';

describe('BoostConsoleFeedComponent', () => {
  let component: BoostConsoleFeedComponent;
  let fixture: ComponentFixture<BoostConsoleFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoostConsoleFeedComponent],
      providers: [
        {
          provide: BoostConsoleService,
          useValue: MockService(BoostConsoleService),
        },
        {
          provide: FeedsService,
          useValue: MockService(FeedsService),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BoostConsoleFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
