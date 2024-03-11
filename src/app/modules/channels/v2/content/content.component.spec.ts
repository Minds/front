import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChannelContentComponent } from './content.component';
import { MockComponent, MockService } from '../../../../utils/mock';
import { ChannelContentService, ChannelContentState } from './content.service';
import { Session } from '../../../../services/session';
import { PermissionsService } from '../../../../common/services/permissions.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { BehaviorSubject } from 'rxjs';
import { PermissionsEnum } from '../../../../../graphql/generated.engine';

describe('ChannelContentComponent', () => {
  let comp: ChannelContentComponent;
  let fixture: ComponentFixture<ChannelContentComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        ChannelContentComponent,
        MockComponent({
          selector: 'm-button',
          outputs: ['onAction'],
        }),
      ],
      providers: [
        { provide: Session, useValue: MockService(Session) },
        {
          provide: PermissionsService,
          useValue: MockService(PermissionsService),
        },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
      ],
    }).overrideProvider(ChannelContentService, {
      useValue: MockService(ChannelContentService, {
        has: ['state$'],
        props: {
          state$: {
            get: () => new BehaviorSubject<ChannelContentState>('nsfw'),
          },
        },
      }),
    });

    fixture = TestBed.createComponent(ChannelContentComponent);
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

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('canShowAccountBannedSection', () => {
    it('should determine if account banned section can be shown', () => {
      (comp as any).session.isAdmin.and.returnValue(false);
      (comp as any).permissions.has
        .withArgs(PermissionsEnum.CanModerateContent)
        .and.returnValue(false);
      expect(comp.canShowAccountBannedSection()).toBeTrue();
    });

    it('should determine if account banned section can NOT be shown because user is an admin', () => {
      (comp as any).session.isAdmin.and.returnValue(true);
      (comp as any).permissions.has
        .withArgs(PermissionsEnum.CanModerateContent)
        .and.returnValue(false);
      expect(comp.canShowAccountBannedSection()).toBeFalse();
    });

    it('should determine if account banned section can NOT be shown because user has moderation permissions', () => {
      (comp as any).session.isAdmin.and.returnValue(false);
      (comp as any).permissions.has
        .withArgs(PermissionsEnum.CanModerateContent)
        .and.returnValue(true);
      expect(comp.canShowAccountBannedSection()).toBeFalse();
    });
  });
});
