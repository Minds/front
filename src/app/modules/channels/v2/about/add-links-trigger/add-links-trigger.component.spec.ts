import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelAddLinksTriggerComponent } from './add-links-trigger.component';
import { ChannelEditIntentService } from '../../services/edit-intent.service';
import { MockService } from '../../../../../utils/mock';

describe('ChannelAddLinksTriggerComponent', () => {
  let component: ChannelAddLinksTriggerComponent;
  let fixture: ComponentFixture<ChannelAddLinksTriggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChannelAddLinksTriggerComponent],
      providers: [
        {
          provide: ChannelEditIntentService,
          useValue: MockService(ChannelEditIntentService),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChannelAddLinksTriggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
