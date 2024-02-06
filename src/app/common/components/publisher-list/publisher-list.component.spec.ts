import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PublisherListComponent } from './publisher-list.component';
import { MindsUser } from '../../../interfaces/entities';
import { MindsGroup } from '../../../modules/groups/v2/group.model';

describe('PublisherListComponent', () => {
  let component: PublisherListComponent;
  let fixture: ComponentFixture<PublisherListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublisherListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublisherListComponent);
    component = fixture.componentInstance;

    // Mock data
    const mockPublishers: (MindsUser | MindsGroup)[] = [
      { type: 'user', name: 'John Doe' } as MindsUser,
      { type: 'group', name: 'Group One', 'members:count': 10 } as MindsGroup,
    ];

    // Set input
    component.publishers = mockPublishers;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all publishers', () => {
    const publisherEls = fixture.debugElement.queryAll(
      By.css('.m-publisherlist__item')
    );
    expect(publisherEls.length).toBe(component.publishers.length);
  });

  it('should emit event when a publisher is removed', () => {
    spyOn(component.publisherRemovedAtIndex, 'emit');

    const removeButtons = fixture.debugElement.queryAll(
      By.css('.m-publisherlist__removeBtn')
    );
    removeButtons[0].triggerEventHandler('click', null);

    expect(component.publisherRemovedAtIndex.emit).toHaveBeenCalledWith(0);
  });
});
