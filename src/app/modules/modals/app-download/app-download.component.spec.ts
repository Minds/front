import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDownloadModalComponent } from './app-download.component';

describe('AppDownloadModalComponent', () => {
  let component: AppDownloadModalComponent;
  let fixture: ComponentFixture<AppDownloadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppDownloadModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppDownloadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
