import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { UserSelectionModalComponent } from './user-selection-modal.component';
import {
  FormBuilder,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MockComponent, MockService } from '../../../utils/mock';
import {
  DEFAULT_ERROR_MESSAGE,
  ToasterService,
} from '../../services/toaster.service';
import { CDN_URL } from '../../injection-tokens/url-injection-tokens';
import { CommonModule as NgCommonModule } from '@angular/common';
import userMock from '../../../mocks/responses/user.mock';

const MOCK_CDN_URL: string = 'https://example.minds.com';

describe('UserSelectionModalComponent', () => {
  let comp: UserSelectionModalComponent;
  let fixture: ComponentFixture<UserSelectionModalComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [UserSelectionModalComponent],
      providers: [
        FormBuilder,
        { provide: ToasterService, useValue: MockService(ToasterService) },
        { provide: CDN_URL, useValue: MOCK_CDN_URL },
      ],
    }).overrideComponent(UserSelectionModalComponent, {
      set: {
        imports: [
          NgCommonModule,
          ReactiveFormsModule,
          MockComponent({
            selector: 'm-modalCloseButton',
            standalone: true,
          }),
          MockComponent({
            selector: 'm-formInput__entityTypeahead',
            outputs: ['loading'],
            providers: [
              {
                provide: NG_VALUE_ACCESSOR,
                useValue: {
                  writeValue: () => {},
                  registerOnChange: () => {},
                  registerOnTouched: () => {},
                },
                multi: true,
              },
            ],
            standalone: true,
          }),
          MockComponent({
            selector: 'm-button',
            inputs: ['color', 'size', 'solid', 'disabled', 'saving'],
            outputs: ['onAction'],
            standalone: true,
          }),
          MockComponent({
            selector: 'm-loadingSpinner',
            inputs: ['inProgress'],
            standalone: true,
          }),
        ],
      },
    });

    fixture = TestBed.createComponent(UserSelectionModalComponent);
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

  describe('ngOnInit', () => {
    it('should handle search matched users change', fakeAsync(() => {
      (comp as any).formGroup
        .get('searchMatchedUsers')
        .setValue([userMock, userMock]);
      tick();

      expect((comp as any).searchMatches$.getValue()).toEqual([
        {
          user: userMock,
          avatarUrl: `${MOCK_CDN_URL}icon/${userMock?.guid}/large/${
            (comp as any).instantiationTime
          }`,
          selected: false,
        },
        {
          user: userMock,
          avatarUrl: `${MOCK_CDN_URL}icon/${userMock?.guid}/large/${
            (comp as any).instantiationTime
          }`,
          selected: false,
        },
      ]);
    }));

    it('should handle search matched users change and correctly identify as already selected', fakeAsync(() => {
      (comp as any).formGroup.get('searchMatchedUsers').setValue([userMock]);
      (comp as any).selectedUsers$.next([userMock]);

      tick();

      expect((comp as any).searchMatches$.getValue()).toEqual([
        {
          user: userMock,
          avatarUrl: `${MOCK_CDN_URL}icon/${userMock?.guid}/large/${
            (comp as any).instantiationTime
          }`,
          selected: true,
        },
      ]);
    }));
  });

  describe('toggleUserSelect', () => {
    it('should toggle user selection OFF', fakeAsync(() => {
      (comp as any).formGroup.get('searchMatchedUsers').setValue([userMock]);
      (comp as any).selectedUsers$.next([userMock]);
      tick();

      (comp as any).toggleUserSelect(userMock);
      tick();

      expect((comp as any).selectedUsers$.getValue()).toEqual([]);
    }));

    it('should toggle user selection ON', fakeAsync(() => {
      (comp as any).formGroup.get('searchMatchedUsers').setValue([userMock]);
      (comp as any).selectedUsers$.next([]);
      tick();

      (comp as any).toggleUserSelect(userMock);
      tick();

      expect((comp as any).selectedUsers$.getValue()).toEqual([userMock]);
    }));
  });

  describe('onConfirmClick', () => {
    it('should handle confirm click', fakeAsync(() => {
      (comp as any).saveFunction = jasmine.createSpy('saveFunction');
      (comp as any).onCompleted = jasmine.createSpy('onCompleted');
      (comp as any).selectedUsers$.next([userMock]);

      (comp as any).onConfirmClick();
      tick();

      expect((comp as any).saveFunction).toHaveBeenCalledWith([userMock]);
      expect((comp as any).onCompleted).toHaveBeenCalled();
    }));

    it('should handle confirm click and fail', fakeAsync(() => {
      (comp as any).saveFunction = jasmine
        .createSpy('saveFunction')
        .and.throwError('error');
      (comp as any).onCompleted = jasmine.createSpy('onCompleted');
      (comp as any).selectedUsers$.next([userMock]);

      (comp as any).onConfirmClick();
      tick();

      expect((comp as any).saveFunction).toHaveBeenCalledWith([userMock]);
      expect((comp as any).onCompleted).not.toHaveBeenCalled();
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        DEFAULT_ERROR_MESSAGE
      );
    }));
  });

  it('should set typeahead loading state', () => {
    (comp as any).loadingResults$.next(false);
    (comp as any).onTypeaheadLoadingStateChange(true);
    expect((comp as any).loadingResults$.getValue()).toBeTrue();
  });

  it('should track results', () => {
    const result: string = (comp as any).trackResultsBy(userMock);
    expect(result).toBe(userMock.guid);
  });
});
