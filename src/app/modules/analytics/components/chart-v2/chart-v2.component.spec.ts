import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UtcDatePipe } from '../../../../common/pipes/utcdate';
import { AbbrPipe } from '../../../../common/pipes/abbr';
import { MockService } from '../../../../utils/mock';
import { ThemeService } from '../../../../common/services/theme.service';
import { ChartV2Component } from './chart-v2.component';

describe('ChartV2Component', () => {
  let component: ChartV2Component;
  let fixture: ComponentFixture<ChartV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChartV2Component, UtcDatePipe, AbbrPipe],
      providers: [
        {
          provide: ThemeService,
          useValue: MockService(ThemeService),
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartV2Component);
    component = fixture.componentInstance;
    component.rawData = {
      id: 'views',
      label: 'Pageviews',
      permissions: ['admin', 'user'],
      unit: 'usd',
      description: '',
      visualisation: {
        type: 'chart',
        segments: [
          {
            buckets: [
              {
                key: 1567296000000,
                date: '2019-09-01T00:00:00+00:00',
                value: 11,
              },
              {
                key: 1567382400000,
                date: '2019-09-02T00:00:00+00:00',
                value: 12,
              },
            ],
          },
        ],
      },
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
