import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { compassServiceMock } from '../../../mocks/modules/compass/compass.service.mock';
import { contentSettingsServiceMock } from '../../../mocks/modules/content-settings/content-settings.service.mock';
import { MockComponent, MockService } from '../../../utils/mock';
import { CompassService } from '../../compass/compass.service';
import { DiscoveryTagsService } from '../../discovery/tags/tags.service';
import { TagSettingsService } from '../../tag-settings/tag-settings.service';
import { ContentSettingsService } from '../content-settings.service';

import { ContentSettingsComponent } from './content-settings.component';

describe('ContentSettingsComponent', () => {
  let component: ContentSettingsComponent;
  let fixture: ComponentFixture<ContentSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ContentSettingsComponent,
        MockComponent({
          selector: 'm-tagSettings',
        }),
        MockComponent({
          selector: 'm-button',
          inputs: ['disabled', 'saving'],
        }),
      ],
      providers: [
        {
          provide: ContentSettingsService,
          useValue: contentSettingsServiceMock,
        },
        {
          provide: CompassService,
          useValue: compassServiceMock,
        },
        {
          provide: TagSettingsService,
          useValue: MockService(TagSettingsService),
        },
        {
          provide: DiscoveryTagsService,
          useValue: MockService(DiscoveryTagsService),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentSettingsComponent);
    component = fixture.componentInstance;

    component.hideCompass = false;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not hide compass if hideCompass is false', () => {
    component.hideCompass = false;

    fixture.detectChanges();

    expect(
      fixture.debugElement.query(
        By.css(`[data-ref=content-settings-modal-tab-compass]`)
      )
    ).toBeTruthy();
  });

  it('should hide compass if hideCompass is true', () => {
    component.hideCompass = true;

    fixture.detectChanges();

    expect(
      fixture.debugElement.query(
        By.css(`[data-ref=content-settings-modal-tab-compass]`)
      )
    ).toBeFalsy();
  });
});
