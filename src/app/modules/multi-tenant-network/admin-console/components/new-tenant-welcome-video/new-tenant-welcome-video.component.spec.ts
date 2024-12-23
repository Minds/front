import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewTenantWelcomeVideoComponent } from './new-tenant-welcome-video.component';
import { PlyrModule } from 'ngx-plyr-mg';
import { By } from '@angular/platform-browser';
import { MockComponent } from '../../../../../utils/mock';
import { STRAPI_URL } from '../../../../../common/injection-tokens/url-injection-tokens';

describe('IntroVideoComponent', () => {
  let comp: NewTenantWelcomeVideoComponent;
  let fixture: ComponentFixture<NewTenantWelcomeVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewTenantWelcomeVideoComponent, PlyrModule],
      providers: [
        { provide: STRAPI_URL, useValue: 'https://example.minds.com' },
      ],
    })
      .overrideComponent(NewTenantWelcomeVideoComponent, {
        set: {
          imports: [
            MockComponent({
              selector: 'plyr',
              inputs: ['plyrPlaysInline', 'plyrSources', 'plyrOptions'],
              standalone: true,
            }),
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NewTenantWelcomeVideoComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should have a plyr element', () => {
    expect(fixture.debugElement.query(By.css('plyr'))).toBeTruthy();
  });

  it('should have correct video source', () => {
    expect((comp as any).sources).toEqual([
      {
        id: '',
        type: '',
        size: null,
        src: 'https://example.minds.com/uploads/new_tenant_welcome_3efce506ff.mp4',
      },
    ]);
  });

  it('should have correct Plyr options', () => {
    expect((comp as any).options).toEqual({
      controls: [
        'play-large',
        'play',
        'progress',
        'current-time',
        'mute',
        'volume',
        'captions',
        'settings',
        'airplay',
        'fullscreen',
      ],
      autoplay: true,
      muted: true,
      hideControls: true,
      storage: { enabled: false },
      loop: { active: true },
    });
  });
});
