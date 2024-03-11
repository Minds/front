import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { Session } from '../../../../services/session';
import { PostMenuService } from '../post-menu.service';
import { PostMenuV2Component } from './menu.component';
import { MockComponent, MockService } from '../../../../utils/mock';
import { AdminSupersetLinkService } from '../../../services/admin-superset-link.service';
import { PermissionsService } from '../../../services/permissions.service';
import { PermissionsEnum } from '../../../../../graphql/generated.engine';

describe('PostMenuV2Component', () => {
  let comp: PostMenuV2Component;
  let fixture: ComponentFixture<PostMenuV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PostMenuV2Component,
        MockComponent({
          selector: 'm-dropdownMenu',
          inputs: ['anchorPosition', 'menu'],
        }),
        MockComponent({
          selector: 'm-dropdownMenu__item',
          outputs: ['click'],
        }),
      ],
      providers: [
        { provide: Session, useValue: MockService(Session) },
        {
          provide: ChangeDetectorRef,
          useValue: MockService(ChangeDetectorRef),
        },
        {
          provide: AdminSupersetLinkService,
          useValue: MockService(AdminSupersetLinkService),
        },
        {
          provide: PermissionsService,
          useValue: MockService(PermissionsService),
        },
      ],
    })
      .overrideProvider(PostMenuService, {
        useValue: MockService(PostMenuService),
      })
      .compileComponents();

    fixture = TestBed.createComponent(PostMenuV2Component);
    comp = fixture.componentInstance;

    comp.entity = {
      guid: '123',
      ownerObj: {
        guid: '234',
      },
    };

    spyOn(comp.optionSelected, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should emit onOptionSelected when option is edit for onSelectedOption', async () => {
    const option = 'edit';
    await comp.onSelectedOption(option);
    expect(comp.optionSelected.emit).toHaveBeenCalledWith(option);
  });

  it('should emit and openShareModal in when option is share for onSelectedOption', async () => {
    const option = 'share';
    await comp.onSelectedOption(option);
    expect(comp.service.openShareModal).toHaveBeenCalled();
    expect(comp.optionSelected.emit).toHaveBeenCalledWith(option);
  });

  it('should call togglePinned and emit when option is pin for onSelectedOption', async () => {
    const option = 'pin';
    await comp.onSelectedOption(option);
    expect(comp.service.togglePinned).toHaveBeenCalled();
    expect(comp.optionSelected.emit).toHaveBeenCalledWith(option);
  });

  it('should emit from optionSelected when option is translate for onSelectedOption', async () => {
    const option = 'translate';
    await comp.onSelectedOption(option);
    expect(comp.optionSelected.emit).toHaveBeenCalledWith(option);
  });

  it('should call subscribe and emit when option is subscribe for onSelectedOption', async () => {
    const option = 'subscribe';
    await comp.onSelectedOption(option);
    expect(comp.service.subscribe).toHaveBeenCalled();
    expect(comp.optionSelected.emit).toHaveBeenCalledWith(option);
  });

  it('should call unSubscribe and emit when option is unsubscribe for onSelectedOption', async () => {
    const option = 'unsubscribe';
    await comp.onSelectedOption(option);
    expect(comp.service.unSubscribe).toHaveBeenCalled();
    expect(comp.optionSelected.emit).toHaveBeenCalledWith(option);
  });

  it('should call follow and emit when option is follow for onSelectedOption', async () => {
    const option = 'follow';
    await comp.onSelectedOption(option);
    expect(comp.service.follow).toHaveBeenCalled();
    expect(comp.optionSelected.emit).toHaveBeenCalledWith(option);
  });

  it('should call unfollow and emit when option is unfollow for onSelectedOption', async () => {
    const option = 'unfollow';
    await comp.onSelectedOption(option);
    expect(comp.service.unfollow).toHaveBeenCalled();
    expect(comp.optionSelected.emit).toHaveBeenCalledWith(option);
  });

  it('should call block and emit when option is block for onSelectedOption', async () => {
    const option = 'block';
    await comp.onSelectedOption(option);
    expect(comp.service.block).toHaveBeenCalled();
    expect(comp.optionSelected.emit).toHaveBeenCalledWith(option);
  });

  it('should call unBlock and emit when option is unblock for onSelectedOption', async () => {
    const option = 'unblock';
    await comp.onSelectedOption(option);
    expect(comp.service.unBlock).toHaveBeenCalled();
    expect(comp.optionSelected.emit).toHaveBeenCalledWith(option);
  });

  it('should call allowComments with true and emit when option is allow-comments for onSelectedOption', async () => {
    const option = 'allow-comments';
    await comp.onSelectedOption('allow-comments');
    expect(comp.service.allowComments).toHaveBeenCalledWith(true);
    expect(comp.optionSelected.emit).toHaveBeenCalledWith(option);
  });

  it('should call allowComments with false and emit when option is disable-comments for onSelectedOption', async () => {
    const option = 'disable-comments';
    await comp.onSelectedOption('disable-comments');
    expect(comp.service.allowComments).toHaveBeenCalledWith(false);
    expect(comp.optionSelected.emit).toHaveBeenCalledWith(option);
  });

  it('should call openBoostModal and emit when option is boost for onSelectedOption', async () => {
    const option = 'boost';
    await comp.onSelectedOption(option);
    expect(comp.service.openBoostModal).toHaveBeenCalled();
    expect(comp.optionSelected.emit).toHaveBeenCalledWith(option);
  });

  it('should call confirmDelete and emit optionSelected when option is delete for onSelectedOption', async () => {
    const option = 'delete';
    await comp.onSelectedOption(option);
    expect(comp.optionSelected.emit).not.toHaveBeenCalledWith(option);
  });

  it('should call openReportModal and emit when option is report for onSelectedOption', async () => {
    const option = 'report';
    await comp.onSelectedOption(option);
    expect(comp.service.openReportModal).toHaveBeenCalled();
    expect(comp.optionSelected.emit).toHaveBeenCalledWith(option);
  });

  it('should get user superset url from admin superset link service', () => {
    comp.entity = {
      guid: '123',
      ownerObj: {
        guid: '234',
      },
    };

    const url: string = 'https://www.minds.com/';
    (comp as any).adminSupersetLink.getUserOverviewUrl.and.returnValue(url);

    expect(comp.getUserSupersetUrl()).toBe(url);
    expect(
      (comp as any).adminSupersetLink.getUserOverviewUrl
    ).toHaveBeenCalledOnceWith('234');
  });

  describe('shouldShowDelete', () => {
    it('should show the delete option because user is the owner', () => {
      const entityOwnerGuid = '12345676890123456';
      const loggedInUserGuid = '12345676890123456';

      (comp as any).mediaModal = false;
      (comp as any).options = ['delete'];
      (comp as any).entity = {
        owner_guid: entityOwnerGuid,
        remind_users: [],
      };
      (comp as any).session.getLoggedInUser.and.returnValue({
        guid: loggedInUserGuid,
      });
      (comp as any).session.isAdmin.and.returnValue(true);
      (comp as any).permissions.has
        .withArgs(PermissionsEnum.CanModerateContent)
        .and.returnValue(true);

      expect(comp.shouldShowDelete()).toBeTrue();
    });

    it('should show the delete option because user is a site admin', () => {
      const entityOwnerGuid = '12345676890123456';
      const loggedInUserGuid = '22345676890123456';

      (comp as any).mediaModal = false;
      (comp as any).options = ['delete'];
      (comp as any).entity = {
        owner_guid: entityOwnerGuid,
        remind_users: [],
      };
      (comp as any).session.getLoggedInUser.and.returnValue({
        guid: loggedInUserGuid,
      });
      (comp as any).session.isAdmin.and.returnValue(true);
      (comp as any).permissions.has
        .withArgs(PermissionsEnum.CanModerateContent)
        .and.returnValue(false);
      (comp as any).canDelete = false;

      expect(comp.shouldShowDelete()).toBeTrue();
    });

    it('should show the delete option because user is has moderation permissions', () => {
      const entityOwnerGuid = '12345676890123456';
      const loggedInUserGuid = '22345676890123456';

      (comp as any).mediaModal = false;
      (comp as any).options = ['delete'];
      (comp as any).entity = {
        owner_guid: entityOwnerGuid,
        remind_users: [],
      };
      (comp as any).session.getLoggedInUser.and.returnValue({
        guid: loggedInUserGuid,
      });
      (comp as any).session.isAdmin.and.returnValue(false);
      (comp as any).permissions.has
        .withArgs(PermissionsEnum.CanModerateContent)
        .and.returnValue(true);
      (comp as any).canDelete = false;

      expect(comp.shouldShowDelete()).toBeTrue();
    });

    it('should show the delete option because the component has canDelete set to true', () => {
      const entityOwnerGuid = '12345676890123456';
      const loggedInUserGuid = '22345676890123456';

      (comp as any).mediaModal = false;
      (comp as any).options = ['delete'];
      (comp as any).entity = {
        owner_guid: entityOwnerGuid,
        remind_users: [],
      };
      (comp as any).session.getLoggedInUser.and.returnValue({
        guid: loggedInUserGuid,
      });
      (comp as any).session.isAdmin.and.returnValue(false);
      (comp as any).permissions.has
        .withArgs(PermissionsEnum.CanModerateContent)
        .and.returnValue(false);
      (comp as any).canDelete = true;

      expect(comp.shouldShowDelete()).toBeTrue();
    });

    it('should not show the delete option in a media modal', () => {
      const entityOwnerGuid = '12345676890123456';
      const loggedInUserGuid = '12345676890123456';

      (comp as any).mediaModal = true;
      (comp as any).options = ['delete'];
      (comp as any).entity = {
        owner_guid: entityOwnerGuid,
        remind_users: [],
      };
      (comp as any).session.getLoggedInUser.and.returnValue({
        guid: loggedInUserGuid,
      });
      (comp as any).session.isAdmin.and.returnValue(true);
      (comp as any).permissions.has
        .withArgs(PermissionsEnum.CanModerateContent)
        .and.returnValue(true);

      expect(comp.shouldShowDelete()).toBeFalse();
    });

    it('should not show the delete option when there are remind users', () => {
      const entityOwnerGuid = '12345676890123456';
      const loggedInUserGuid = '12345676890123456';

      (comp as any).mediaModal = false;
      (comp as any).options = ['delete'];
      (comp as any).entity = {
        owner_guid: entityOwnerGuid,
        remind_users: ['123'],
      };
      (comp as any).session.getLoggedInUser.and.returnValue({
        guid: loggedInUserGuid,
      });
      (comp as any).session.isAdmin.and.returnValue(true);
      (comp as any).permissions.has
        .withArgs(PermissionsEnum.CanModerateContent)
        .and.returnValue(true);

      expect(comp.shouldShowDelete()).toBeFalse();
    });

    it('should not show the delete option when there is no delete option specified', () => {
      const entityOwnerGuid = '12345676890123456';
      const loggedInUserGuid = '12345676890123456';

      (comp as any).mediaModal = false;
      (comp as any).options = [];
      (comp as any).entity = {
        owner_guid: entityOwnerGuid,
        remind_users: [],
      };
      (comp as any).session.getLoggedInUser.and.returnValue({
        guid: loggedInUserGuid,
      });
      (comp as any).session.isAdmin.and.returnValue(true);
      (comp as any).permissions.has
        .withArgs(PermissionsEnum.CanModerateContent)
        .and.returnValue(true);

      expect(comp.shouldShowDelete()).toBeFalse();
    });

    it('should not show the delete option because user is not elibile to delete', () => {
      const entityOwnerGuid = '12345676890123456';
      const loggedInUserGuid = '22345676890123456';

      (comp as any).mediaModal = false;
      (comp as any).options = ['delete'];
      (comp as any).entity = {
        owner_guid: entityOwnerGuid,
        remind_users: [],
      };
      (comp as any).session.getLoggedInUser.and.returnValue({
        guid: loggedInUserGuid,
      });
      (comp as any).session.isAdmin.and.returnValue(false);
      (comp as any).permissions.has
        .withArgs(PermissionsEnum.CanModerateContent)
        .and.returnValue(false);
      (comp as any).canDelete = false;

      expect(comp.shouldShowDelete()).toBeFalse();
    });
  });

  it('should not show the edit button for site membership posts', () => {
    comp.mediaModal = false;
    (comp as any).permissions.canCreatePost.and.returnValue(true);
    (comp as any).session.getLoggedInUser.and.returnValue({ guid: '234' });
    comp.entity = {
      guid: '123',
      owner_guid: '234', // We own the post
      site_membership: true,
    };
    comp.options = ['edit', 'delete', 'share'];

    fixture.detectChanges();

    const result = comp.shouldShowEdit();
    expect(result).toBeFalse();
  });

  it('should not hide the edit button when not a site membership post', () => {
    comp.mediaModal = false;
    (comp as any).permissions.canCreatePost.and.returnValue(true);
    (comp as any).session.getLoggedInUser.and.returnValue({ guid: '234' });
    comp.entity = {
      guid: '123',
      owner_guid: '234', // We own the post
    };
    comp.options = ['edit', 'delete', 'share'];

    fixture.detectChanges();

    const result = comp.shouldShowEdit();
    expect(result).toBeTrue();
  });
});
