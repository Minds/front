import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { PermawebTermsComponent } from './permaweb-terms.component';
import { ComposerService } from '../../../services/composer.service';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from '../../../../../common/components/button/button.component';
import { FormsModule } from '@angular/forms';

describe('Permaweb Terms Component', () => {
  let comp: PermawebTermsComponent;
  let fixture: ComponentFixture<PermawebTermsComponent>;

  const postToPermaweb$ = jasmine.createSpyObj('postToPermaweb$', {
    next: () => {},
  });

  const composerServiceMock: any = MockService(ComposerService, {
    has: ['postToPermaweb$', 'title$'],
    props: {
      postToPermaweb$: { get: () => postToPermaweb$ },
    },
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [PermawebTermsComponent, ButtonComponent],
      providers: [
        {
          provide: ComposerService,
          useValue: composerServiceMock,
        },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    fixture = TestBed.createComponent(PermawebTermsComponent);
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

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should have terms', () => {
    expect(
      fixture.debugElement.query(By.css('.m-composerPopup__text'))
    ).toBeDefined();
  });

  it('should allow user to check checkbox', () => {
    const checkbox = fixture.debugElement.query(
      By.css("input[type='checkbox']")
    );

    expect(checkbox).toBeDefined();
    expect(checkbox.nativeElement.checked).toBeFalsy();

    checkbox.nativeElement.click();

    expect(checkbox.nativeElement.checked).toBeTruthy();
  });

  it('should allow the user to save and dismiss the modal', async () => {
    spyOn(comp.dismissIntent, 'emit');
    const checkbox = fixture.debugElement.query(
      By.css("input[type='checkbox']")
    );

    checkbox.nativeElement.click();
    await comp.save();

    expect((comp as any).service.postToPermaweb$.next).toHaveBeenCalled();
    expect(comp.dismissIntent.emit).toHaveBeenCalled();
  });
});
