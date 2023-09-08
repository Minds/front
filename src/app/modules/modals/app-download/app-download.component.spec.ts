import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDownloadModalComponent } from './app-download.component';
import { ConfigsService } from '../../../common/services/configs.service';
import { MockService } from '../../../utils/mock';

describe('AppDownloadModalComponent', () => {
  let component: AppDownloadModalComponent;
  let fixture: ComponentFixture<AppDownloadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppDownloadModalComponent],
      providers: [
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppDownloadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
