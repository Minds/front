import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MockComponent, MockService } from '../../../utils/mock';
import { ExplainerScreenModalComponent } from './explainer-screen-modal.component';
import { MarkdownService } from 'ngx-markdown';
import { Renderer } from 'marked';
import { ExplainerScreenWeb } from '../../../../graphql/generated.strapi';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Session } from '../../../services/session';
import { AuthModalService } from '../../auth/modal/auth-modal.service';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

const mockScreenData: ExplainerScreenWeb = {
  __typename: 'ExplainerScreenWeb',
  continueButton: {
    __typename: 'ComponentExplainerScreenContinueButton',
    id: 'id',
    text: 'Continue',
    dataRef: 'data-ref-continue',
  },
  createdAt: 1688988708,
  key: 'boost',
  publishedAt: 1688988708,
  section: [
    {
      __typename: 'ComponentExplainerScreenSection',
      id: '1',
      title: 'Boost section title 1',
      description: 'Boost section description 1',
      icon: 'icon1',
    },
    {
      __typename: 'ComponentExplainerScreenSection',
      id: '2',
      title: 'Boost section title 2',
      description: 'Boost section description 2',
      icon: 'icon2',
    },
  ],
  subtitle: 'Boost subtitle',
  title: 'Boost',
  triggerRoute: 'boost/console',
  updatedAt: 1688988708,
};

describe('ExplainerScreenModalComponent', () => {
  let comp: ExplainerScreenModalComponent;
  let fixture: ComponentFixture<ExplainerScreenModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ExplainerScreenModalComponent,
        MockComponent({
          selector: 'm-button',
          inputs: ['color', 'saving', 'solid'],
          outputs: ['onAction'],
        }),
        MockComponent({ selector: 'markdown' }),
        MockComponent({ selector: 'm-modalCloseButton' }),
      ],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        {
          provide: MarkdownService,
          useValue: MockService(MarkdownService, {
            has: ['renderer'],
            props: {
              renderer: {
                get: () => new Renderer(),
              },
            },
          }),
        },
        { provide: Session, useValue: MockService(Session) },
        { provide: AuthModalService, useValue: MockService(AuthModalService) },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplainerScreenModalComponent);
    comp = fixture.componentInstance;

    comp.explainerScreenData = mockScreenData;
    (comp as any).session.isLoggedIn.and.returnValue(true);

    fixture.detectChanges();
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should handle action button click when logged in', () => {
    (comp as any).session.isLoggedIn.and.returnValue(true);
    spyOn(comp, 'onDismissIntent');

    comp.onActionButtonClick();

    expect((comp as any).authModal.open).not.toHaveBeenCalled();
    expect(comp.onDismissIntent).toHaveBeenCalled();
  });

  it('should handle action button click when logged out', () => {
    (comp as any).session.isLoggedIn.and.returnValue(false);
    spyOn(comp, 'onDismissIntent');

    comp.onActionButtonClick();

    expect((comp as any).authModal.open).toHaveBeenCalled();
    expect(comp.onDismissIntent).toHaveBeenCalled();
  });

  it('should have title in template from CMS data', () => {
    expect(
      fixture.debugElement
        .query(By.css('.m-explainerScreenModal__header'))
        .nativeElement.innerText.trim()
    ).toBe(mockScreenData.title);
  });

  it('should have description in template from CMS data', () => {
    expect(
      fixture.debugElement
        .query(By.css('.m-explainerScreenModal__subheader'))
        .nativeElement.innerText.trim()
    ).toBe(mockScreenData.subtitle);
  });

  it('should have section icons in template from CMS data', () => {
    const icons: DebugElement[] = fixture.debugElement.queryAll(
      By.css('.m-explainerScreenModalItem__icon')
    );

    expect(icons[0].nativeElement.innerText.trim()).toBe(
      mockScreenData.section[0].icon
    );
    expect(icons[1].nativeElement.innerText.trim()).toBe(
      mockScreenData.section[1].icon
    );
  });

  it('should have section titles in template from CMS data', () => {
    const titles: DebugElement[] = fixture.debugElement.queryAll(
      By.css('.m-explainerScreenModalItemText__header')
    );

    expect(titles[0].nativeElement.innerText.trim()).toBe(
      mockScreenData.section[0].title
    );
    expect(titles[1].nativeElement.innerText.trim()).toBe(
      mockScreenData.section[1].title
    );
  });

  describe('isLoggedIn', () => {
    it('should determine if a user is logged in', () => {
      (comp as any).session.isLoggedIn.and.returnValue(true);
      expect(comp.isLoggedIn()).toBe(true);
    });

    it('should determine if a user is NOT logged in', () => {
      (comp as any).session.isLoggedIn.and.returnValue(false);
      expect(comp.isLoggedIn()).toBe(false);
    });
  });
});
