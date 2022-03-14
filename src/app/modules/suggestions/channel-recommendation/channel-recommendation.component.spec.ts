import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiService } from '../../../common/api/api.service';
import { apiServiceMock } from '../../boost/modal/boost-modal.service.spec';
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
