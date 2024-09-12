import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { MockComponent, MockService } from '../../../utils/mock';
import { GroupsTileComponent } from './tile.component';
import { Session } from '../../../services/session';
import { UpdateMarkersService } from '../../../common/services/update-markers.service';
import { ConfigsService } from '../../../common/services/configs.service';

describe('GroupsTileComponent', () => {
  let comp: GroupsTileComponent;
  let fixture: ComponentFixture<GroupsTileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        GroupsTileComponent,
        MockComponent({
          selector: 'm-group__membershipButton',
          inputs: ['group', 'navigateOnJoin'],
          outputs: ['onMembershipChange', 'click'],
        }),
        MockComponent({
          selector: 'm-button',
          inputs: ['color'],
        }),
        MockComponent({
          selector: 'm-safe-toggle',
          inputs: ['entity'],
        }),
      ],
      providers: [
        {
          provide: Session,
          useValue: MockService(Session, {
            has: ['isAdmin'],
            props: {
              isAdmin: () => false,
            },
          }),
        },
        {
          provide: UpdateMarkersService,
          useValue: MockService(UpdateMarkersService, {
            has: ['markers'],
            props: {
              markers: { get: () => new BehaviorSubject([]) },
            },
          }),
        },
        {
          provide: ConfigsService,
          useValue: MockService(ConfigsService),
        },
      ],
    });

    fixture = TestBed.createComponent(GroupsTileComponent);
    comp = fixture.componentInstance;

    comp.entity = {
      guid: '123',
      name: 'Test Group',
      'members:count': 100,
      'is:member': false,
    };
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should update entity membership status on membership change', () => {
    comp.onMembershipChange({ isMember: true });
    expect(comp.entity['is:member']).toBeTruthy();
  });

  it('should prevent event propagation on membership button click', () => {
    const event = new MouseEvent('click');
    spyOn(event, 'preventDefault');
    spyOn(event, 'stopPropagation');

    (comp as any).onMembershipButtonClick(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  });
});
