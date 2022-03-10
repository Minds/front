import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockService } from '../../../utils/mock';
import { DiscoveryTagsService } from '../../discovery/tags/tags.service';

import { TagSettingsComponent } from './tag-settings.component';

describe('TagSettingsComponent', () => {
  let component: TagSettingsComponent;
  let fixture: ComponentFixture<TagSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TagSettingsComponent,
        MockComponent({
          selector: 'm-loadingSpinner',
          inputs: ['inProgress'],
        }),
        MockComponent({
          selector: 'm-tagSelector',
          inputs: ['tags'],
        }),
        MockComponent({
          selector: 'm-hashtags__typeaheadInput',
        }),
      ],
      providers: [
        {
          provide: DiscoveryTagsService,
          useValue: MockService(DiscoveryTagsService),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
