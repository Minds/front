import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NetworkAdminBookAMeetingComponent } from './book-a-meeting.component';
import { CalDotComOpenButtonComponent } from '../../../components/caldotcom-open-button/caldotcom-open-button';
import { MockComponent } from '../../../../../../utils/mock';

describe('NetworkAdminBookAMeetingComponent', () => {
  let component: NetworkAdminBookAMeetingComponent;
  let fixture: ComponentFixture<NetworkAdminBookAMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkAdminBookAMeetingComponent],
    })
      .overrideComponent(NetworkAdminBookAMeetingComponent, {
        remove: { imports: [CalDotComOpenButtonComponent] },
        add: {
          imports: [
            MockComponent({
              selector: 'm-calDotComOpenButton',
              standalone: true,
            }),
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkAdminBookAMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a title', () => {
    const titleElement = fixture.debugElement.query(
      By.css('.m-networkAdminConsole__title')
    );
    expect(titleElement).toBeTruthy();
    expect(titleElement.nativeElement.textContent.trim()).toBe('Meet with us');
  });

  it('should have a description', () => {
    const descriptionElement = fixture.debugElement.query(
      By.css('.m-networkAdminBookAMeeting__description')
    );
    expect(descriptionElement).toBeTruthy();
    expect(descriptionElement.nativeElement.textContent.trim()).toBe(
      'Have questions about your network, want support setting up things, or otherwise want to talk with us? Pick a time that works for you.'
    );
  });

  it('should include CalDotComOpenButtonComponent', () => {
    const calDotComOpenButton = fixture.debugElement.query(
      By.css('m-calDotComOpenButton')
    );
    expect(calDotComOpenButton).toBeTruthy();
  });
});
