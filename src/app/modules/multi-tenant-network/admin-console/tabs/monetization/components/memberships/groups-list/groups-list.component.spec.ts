import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminMonetizationGroupsListComponent } from './groups-list.component';
import { MockComponent } from '../../../../../../../../utils/mock';
import { siteMembershipMock } from '../../../../../../../../mocks/site-membership.mock';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { TruncatePipe } from '../../../../../../../../common/pipes/truncate.pipe';
import { RouterTestingModule } from '@angular/router/testing';

describe('NetworkAdminMonetizationGroupsListComponent', () => {
  let comp: NetworkAdminMonetizationGroupsListComponent;
  let fixture: ComponentFixture<NetworkAdminMonetizationGroupsListComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        NetworkAdminMonetizationGroupsListComponent,
        TruncatePipe,
        MockComponent({
          selector: 'minds-avatar',
          inputs: ['object'],
        }),
      ],
    });

    fixture = TestBed.createComponent(
      NetworkAdminMonetizationGroupsListComponent
    );
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

  it('should render groups', () => {
    comp.groups = siteMembershipMock.groups;
    fixture.detectChanges();

    const groupRowElements: DebugElement[] = fixture.debugElement.queryAll(
      By.css('.m-networkMembershipAccordian__groupRow')
    );

    expect(groupRowElements.length).toBe(2);

    const groupNameElements: DebugElement[] = fixture.debugElement.queryAll(
      By.css('.m-networkMembershipAccordian__groupName')
    );

    expect(groupNameElements[0].nativeElement.textContent).toContain(
      siteMembershipMock.groups[0].name
    );
    expect(groupNameElements[1].nativeElement.textContent).toContain(
      siteMembershipMock.groups[1].name
    );

    const groupMembersElements: DebugElement[] = fixture.debugElement.queryAll(
      By.css('.m-networkMembershipAccordian__groupMembers')
    );

    expect(groupMembersElements[0].nativeElement.textContent).toContain(
      siteMembershipMock.groups[0].membersCount
    );
    expect(groupMembersElements[1].nativeElement.textContent).toContain(
      siteMembershipMock.groups[1].membersCount
    );
  });

  describe('deleteButton', () => {
    it('should render delete button when showDeleteButton is true', () => {
      spyOn(comp.onDeleteClickEmitter, 'emit');

      comp.groups = siteMembershipMock.groups;
      comp.showDeleteButton = true;
      fixture.detectChanges();

      const deleteButtonElement: DebugElement = fixture.debugElement.queryAll(
        By.css('.m-networkMembershipAccordian__groupRemoveIcon')
      )[0];

      expect(deleteButtonElement).toBeTruthy();
    });

    it('should NOT render delete button when showDeleteButton is false', () => {
      spyOn(comp.onDeleteClickEmitter, 'emit');

      comp.groups = siteMembershipMock.groups;
      comp.showDeleteButton = false;
      fixture.detectChanges();

      const deleteButtonElements: DebugElement[] = fixture.debugElement.queryAll(
        By.css('.m-networkMembershipAccordian__groupRemoveIcon')
      );

      expect(deleteButtonElements?.length).toBeFalsy();
    });

    it('should fire event on click of delete button', () => {
      spyOn(comp.onDeleteClickEmitter, 'emit');

      comp.groups = siteMembershipMock.groups;
      comp.showDeleteButton = true;
      fixture.detectChanges();

      const deleteButtonElement: DebugElement = fixture.debugElement.queryAll(
        By.css('.m-networkMembershipAccordian__groupRemoveIcon')
      )[0];

      deleteButtonElement.nativeElement.click();
      expect(comp.onDeleteClickEmitter.emit).toHaveBeenCalledWith(
        siteMembershipMock.groups[0]
      );
    });
  });
});
