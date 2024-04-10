import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CustomPageComponent } from './custom-page.component';
import { CustomPageService } from '../../multi-tenant-network/services/custom-page.service';
import {
  CustomPageType,
  CustomPageImplementation,
} from '../custom-pages.types';
import { By } from '@angular/platform-browser';

describe('CustomPageComponent', () => {
  let component: CustomPageComponent;
  let fixture: ComponentFixture<CustomPageComponent>;
  let customPageServiceMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    customPageServiceMock = {
      fetchCustomPage: jasmine.createSpy('fetchCustomPage'),
      customPage$: new BehaviorSubject(null),
    };

    activatedRouteMock = {
      snapshot: { data: { pageType: CustomPageType.PRIVACY_POLICY } },
    };

    await TestBed.configureTestingModule({
      declarations: [CustomPageComponent],
      providers: [
        { provide: CustomPageService, useValue: customPageServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch custom page on init', () => {
    expect(customPageServiceMock.fetchCustomPage).toHaveBeenCalledWith(
      CustomPageType.PRIVACY_POLICY
    );
  });

  it('should set loading to false after fetching custom page', (done) => {
    customPageServiceMock.customPage$.next({
      implementation: CustomPageImplementation.DEFAULT,
      displayName: 'Privacy Policy',
      displayContent: 'Test content',
    });

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.loading$.getValue()).toBe(false);
      done();
    });
  });

  it('should call redirectToExternalLink when there is no displayContent', () => {
    spyOn(component, 'redirectToExternalLink');

    const customPage = {
      implementation: CustomPageImplementation.EXTERNAL,
      externalLink: 'https://example.com',
      displayContent: null,
    };
    customPageServiceMock.customPage$.next(customPage);

    fixture.detectChanges();

    expect(component.redirectToExternalLink).toHaveBeenCalled();
  });

  it('should display content when displayContent is provided', () => {
    const customPage = {
      implementation: CustomPageImplementation.CUSTOM,
      displayContent: 'Test Content',
      externalLink: null,
    };
    customPageServiceMock.customPage$.next(customPage);

    fixture.detectChanges();

    const markdownElement = fixture.debugElement.query(By.css('markdown'));
    expect(markdownElement.nativeElement.innerText).toBeDefined();
  });
});
