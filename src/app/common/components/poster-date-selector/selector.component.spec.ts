import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { PosterDateSelectorComponent } from './selector.component';
import { FormsModule } from '@angular/forms';
import { MockComponent } from '../../../utils/mock';

describe('PosterDateSelectorComponent', () => {
  let comp: PosterDateSelectorComponent;
  let fixture: ComponentFixture<PosterDateSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PosterDateSelectorComponent,
        MockComponent({
          selector: 'm-date-selector',
          template: '<ng-content></ng-content>',
          inputs: [
            'date',
            'hideInput',
            'tooltipIcon',
            'tooltipText',
            'i18n',
            'calendarType',
          ],
        }),
      ],
      imports: [FormsModule],
    }).compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(PosterDateSelectorComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should emit when onDateChange is called', fakeAsync(() => {
    spyOn(comp.dateChange, 'emit');
    const testDate = new Date();
    testDate.setMonth(testDate.getMonth() + 1);
    comp.onDateChange(testDate.toString());
    let timeDate = testDate.getTime();
    timeDate = Math.floor(timeDate / 1000);
    expect(comp.dateChange.emit).toHaveBeenCalledWith(timeDate);
  }));

  it('should emit onError when date more than 3 months', fakeAsync(() => {
    spyOn(comp.onError, 'emit');
    const testDate = new Date();
    testDate.setMonth(testDate.getMonth() + 4);
    comp.onDateChange(testDate.toString());
    let timeDate = testDate.getTime();
    timeDate = Math.floor(timeDate / 1000);
    expect(comp.onError.emit).toHaveBeenCalledWith(
      "Scheduled date can't be 3 months or more"
    );
  }));

  it('should emit onError when date less than 5 minutes or in the past', fakeAsync(() => {
    spyOn(comp.onError, 'emit');
    const testDate = new Date();
    comp.onDateChange(testDate.toString());
    let timeDate = testDate.getTime();
    timeDate = Math.floor(timeDate / 1000);
    expect(comp.onError.emit).toHaveBeenCalledWith(
      "Scheduled date can't be less than 5 minutes or in the past"
    );
  }));
});
