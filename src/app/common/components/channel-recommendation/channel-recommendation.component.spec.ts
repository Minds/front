import { apiServiceMock } from './../../../modules/boost/modal/boost-modal.service.spec';
import { ApiService } from './../../api/api.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelRecommendationComponent } from './channel-recommendation.component';

describe('ChannelRecommendationComponent', () => {
  let component: ChannelRecommendationComponent;
  let fixture: ComponentFixture<ChannelRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChannelRecommendationComponent],
      providers: [
        {
          provide: ApiService,
          useValue: apiServiceMock,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
