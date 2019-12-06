import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MindsProAvatarComponent } from './pro-avatar.component';
import { clientMock } from '../../../../tests/client-mock.spec';
import { fakeAsync } from '@angular/core/testing';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { MockService, MockComponent } from '../../../utils/mock';
import { ProChannelService } from '../channel/channel.service';

const proChannelServiceMock: any = MockService(ProChannelService, {
  props: {
    isProDomain: { get: () => false },
    pro: { get: () => false },
  },
});

describe('MindsProAvatarComponent', () => {
  let comp: MindsProAvatarComponent;
  let fixture: ComponentFixture<MindsProAvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent({
          selector: 'minds-avatar',
          inputs: ['object', 'routerLink'],
        }),
        MockComponent({
          selector: 'img',
          inputs: ['routerLink'],
        }),
        MindsProAvatarComponent,
      ],
      imports: [],
      providers: [
        { provide: ProChannelService, useValue: proChannelServiceMock },
      ],
    }).compileComponents();
  }));

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    fixture = TestBed.createComponent(MindsProAvatarComponent);

    window.Minds = <any>{
      user: {
        guid: 1,
        name: 'test',
        opted_in_hashtags: 1,
      },
    };

    comp = fixture.componentInstance;

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be instantiated', () => {
    expect(comp).toBeTruthy();
  });

  it('should not show a logo if none available', fakeAsync(() => {
    comp.channel = <any>{
      pro_settings: {
        has_custom_logo: false,
      },
    };
    expect(comp.hasLogo()).toBeFalsy();
  }));

  it('should show logo if one is', fakeAsync(() => {
    comp.channel = <any>{
      pro_settings: {
        has_custom_logo: true,
      },
    };
    expect(comp.hasLogo()).toBeTruthy();
  }));

  it('should get logo', fakeAsync(() => {
    comp.channel = <any>{
      pro_settings: {
        logo_image: 'image.png',
        has_custom_logo: true,
      },
    };
    expect(comp.logo).toBe('image.png');
  }));
});
