import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from '../../../utils/mock';
import { ExperimentsService } from '../../../modules/experiments/experiments.service';

import { FeedHeaderComponent } from './feed-header.component';

describe('FeedHeaderComponent', () => {
  let component: FeedHeaderComponent;
  let fixture: ComponentFixture<FeedHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FeedHeaderComponent],
      providers: [
        {
          provide: ExperimentsService,
          useValue: MockService(ExperimentsService),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
