import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { WelcomeOnboardingComponent } from "./welcome.component";
import { clientMock } from "../../../../../tests/client-mock.spec";
import { By } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialMock } from "../../../../../tests/material-mock.spec";
import { MaterialSwitchMock } from "../../../../../tests/material-switch-mock.spec";
import { AbbrPipe } from "../../../../common/pipes/abbr";
import { Client } from "../../../../services/api/client";
import { DebugElement } from "@angular/core";

describe('WelcomeOnboardingComponent', () => {

  let comp: WelcomeOnboardingComponent;
  let fixture: ComponentFixture<WelcomeOnboardingComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [
        MaterialMock,
        MaterialSwitchMock,
        AbbrPipe,
        WelcomeOnboardingComponent
      ],
      providers: [
        { provide: Client, useValue: clientMock },
      ]
    })
        .compileComponents();
  }));

  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(WelcomeOnboardingComponent);

    window.Minds = <any>{
      user: {
        guid: 1,
        name: 'test',
        briefdescription: '',
        opted_in_hashtags: 1
      }
    };

    clientMock.response = {};

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

  it('should have a title', () => {
    expect(fixture.debugElement.query(By.css('h2')).nativeElement.textContent).toBe('Welcome to Minds!');
  });

  it('should have a subtext', () => {
    expect(fixture.debugElement.query(By.css('.m-channelOnboardingSlide__column .m-channelOnboardingSlide__subtext:first-child')).nativeElement.textContent)
        .toContain('Before you get started, there are a few things we need to know to provide you with the best experience.');

    expect(fixture.debugElement.query(By.css('.m-channelOnboardingSlide__column .m-channelOnboardingSlide__subtext:last-child')).nativeElement.textContent)
        .toContain('First off, how often do you post to social media?');
  });

  it('should have a list with frequencies', () => {
    const list: DebugElement = fixture.debugElement.query(By.css('ul.m-channelOnboardingSlide__frequency'));
    expect(list).not.toBeNull();

    const options = fixture.debugElement.queryAll(By.css('ul.m-channelOnboardingSlide__frequency > li'));

    expect(options.length).toBe(3);

    expect(options[0].nativeElement.textContent).toContain('Rarely');
    expect(options[1].nativeElement.textContent).toContain('Sometimes');
    expect(options[2].nativeElement.textContent).toContain('Frequently');
  });

  it('should save the frequency when clicked', fakeAsync(() => {
    const url = 'api/v2/onboarding/creator_frequency';
    const option = fixture.debugElement.query(By.css('ul.m-channelOnboardingSlide__frequency > li:first-child'));

    spyOn(comp.onClose, 'emit').and.stub();

    option.nativeElement.click();

    fixture.detectChanges();
    jasmine.clock().tick(10);

    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toBe(url);
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual({ value: 'rarely' });

    expect(comp.onClose.emit).toHaveBeenCalled();
  }));

});
