import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsellButtonComponent } from './upsell-button.component';
import { ConfigsService } from '../../../../common/services/configs.service';
import { MockService } from '../../../../utils/mock';

describe('UpsellButtonComponent', () => {
  let component: UpsellButtonComponent;
  let fixture: ComponentFixture<UpsellButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsellButtonComponent],
      providers: [
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpsellButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
