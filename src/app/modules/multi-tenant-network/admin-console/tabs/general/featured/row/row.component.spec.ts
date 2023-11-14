import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DeleteFeaturedEntityGQL,
  FeaturedUser,
} from '../../../../../../../../graphql/generated.engine';
import { ToasterService } from '../../../../../../../common/services/toaster.service';
import { MindsAvatarObject } from '../../../../../../../common/components/avatar/avatar';
import { NetworkAdminConsoleFeaturedEntityRowComponent } from './row.component';
import { MockComponent, MockService } from '../../../../../../../utils/mock';
import { TruncatePipe } from '../../../../../../../common/pipes/truncate.pipe';
import { of, throwError } from 'rxjs';

describe('NetworkAdminConsoleFeaturedEntityRowComponent', () => {
  let comp: NetworkAdminConsoleFeaturedEntityRowComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleFeaturedEntityRowComponent>;
  let mockFeaturedUser: FeaturedUser = {
    entityGuid: '123',
    __typename: 'FeaturedUser',
    username: 'testusername',
    name: 'testuser',
    autoSubscribe: null,
    id: null,
    recommended: null,
    tenantId: null,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NetworkAdminConsoleFeaturedEntityRowComponent,
        TruncatePipe,
        MockComponent({
          selector: 'm-button',
          inputs: ['saving'],
        }),
        MockComponent({
          selector: 'minds-avatar',
          inputs: ['object'],
        }),
        MockComponent({
          selector: 'm-dropdownMenu',
          inputs: ['menu', 'anchorPosition', 'disabled'],
          outputs: ['click'],
        }),
      ],
      providers: [
        {
          provide: DeleteFeaturedEntityGQL,
          useValue: jasmine.createSpyObj('DeleteFeaturedEntityGQL', ['mutate']),
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(
      NetworkAdminConsoleFeaturedEntityRowComponent
    );
    comp = fixture.componentInstance;
    comp.featuredEntity = mockFeaturedUser;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('buildAvatarEntity', () => {
    it('should build avatar entity', () => {
      comp.featuredEntity.__typename = 'FeaturedUser';
      const avatarEntity: MindsAvatarObject = comp.buildAvatarEntity();
      expect(avatarEntity.guid).toEqual(mockFeaturedUser.entityGuid);
      expect(avatarEntity.type).toEqual('user');
    });
  });

  describe('onOptionToggle', () => {
    it('should emit onDeletion event when onDeleteClicked is called', async () => {
      (comp as any).deleteFeaturedEntityGQL.mutate.and.returnValue(
        of({
          data: {
            deleteFeaturedEntity: true,
          },
        })
      );
      spyOn(comp.onDeletion, 'emit');
      await comp.onDeleteClicked();
      expect(comp.onDeletion.emit).toHaveBeenCalledWith(
        comp.featuredEntity.entityGuid
      );
    });

    it('should show error toaster when onDeleteClicked mutation throws an error', async () => {
      (comp as any).deleteFeaturedEntityGQL.mutate.and.returnValue(
        of(throwError(() => new Error()))
      );
      await comp.onDeleteClicked();
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'Failed to make entity non-featured.'
      );
    });
  });

  describe('navigateToEntity', () => {
    it('should navigate to user', () => {
      spyOn(window, 'open');
      comp.featuredEntity.__typename = 'FeaturedUser';
      comp.navigateToEntity();
      expect(window.open).toHaveBeenCalledWith(
        `/${mockFeaturedUser.username}`,
        '_blank'
      );
    });

    it('should navigate to group', () => {
      spyOn(window, 'open');
      comp.featuredEntity.__typename = 'FeaturedGroup';
      comp.navigateToEntity();
      expect(window.open).toHaveBeenCalledWith(
        `/group/${mockFeaturedUser.entityGuid}`,
        '_blank'
      );
    });
  });
});
