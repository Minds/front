import {
  ComponentFixture,
  TestBed,
  discardPeriodicTasks,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormControl, FormsModule, NgControl } from '@angular/forms';
import { ApiService } from '../../../api/api.service';
import { MockService } from '../../../../utils/mock';
import userMock from '../../../../mocks/responses/user.mock';
import { of, take, throttleTime } from 'rxjs';
import { Session } from '../../../../services/session';
import { AutocompleteUserInputComponent } from './autocomplete-user-input.component';
import { ConfigsService } from '../../../services/configs.service';

describe('AutocompleteUserInputComponent', () => {
  let comp: AutocompleteUserInputComponent;
  let fixture: ComponentFixture<AutocompleteUserInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [AutocompleteUserInputComponent],
      providers: [
        {
          provide: NgControl,
          useValue: MockService(NgControl),
        },
        {
          provide: ApiService,
          useValue: MockService(ApiService),
        },
        {
          provide: Session,
          useValue: MockService(Session),
        },
        {
          provide: ConfigsService,
          useValue: MockService(ConfigsService),
        },
      ],
    })
      .overrideComponent(AutocompleteUserInputComponent, {
        add: {
          providers: [
            {
              provide: NgControl,
              useClass: class extends NgControl {
                control = new FormControl();
                viewToModelUpdate() {}
              },
            },
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteUserInputComponent);
    comp = fixture.componentInstance;

    comp.username$$.next(null);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      comp.propagateChange = jasmine.createSpy('propagateChange');
    });

    it('should propagate change out when entityRef$ is updated with an entity', fakeAsync(() => {
      comp.username$$.next(userMock);

      tick();
      expect(comp.propagateChange).toHaveBeenCalledWith(userMock);
      discardPeriodicTasks();
    }));
  });

  describe('showPopout$', () => {
    it('should show popout because focused and has entities', fakeAsync(() => {
      comp.username$$.next('abc');

      (comp as any).api.get.and.returnValue(
        of({
          entities: [userMock],
        })
      );

      comp.inProgress$$.next(false);
      comp.isFocused$$.next(true);

      tick(100);

      comp.showPopout$.pipe(take(1)).subscribe((showPopout) => {
        expect(showPopout).toBe(true);
      });

      discardPeriodicTasks();
    }));
  });

  describe('entitySelection', () => {
    let mockApiService: ApiService;

    beforeEach(() => {
      mockApiService = TestBed.inject(ApiService);
      comp.propagateChange = jasmine.createSpy('propagateChange');
    });

    it('should propagate change when a group is selected', fakeAsync(() => {
      (comp as any).api.get.and.returnValue(of({ entities: [userMock] }));

      comp.onUserSelect(userMock);

      tick();
      expect(comp.propagateChange).toHaveBeenCalledWith('minds');
      discardPeriodicTasks();
    }));

    it('should propagate change when a user is selected', fakeAsync(() => {
      (comp as any).api.get.and.returnValue(of({ entities: [userMock] }));

      comp.onUserSelect(userMock);

      tick();
      expect(comp.propagateChange).toHaveBeenCalledWith('minds');
      discardPeriodicTasks();
    }));
  });

  describe('matchedEntitiesList', () => {
    it('should get results from server with nsfw included when a user opts into nsfw', (done: DoneFn) => {
      const seachTerm: string = 'username_test';
      (comp as any).api.get.and.returnValue(of({ entities: [userMock] }));
      (comp as any).session.getLoggedInUser.and.returnValue({
        ...userMock,
        mature: 1,
      });
      comp.username$$.next(seachTerm);

      comp.matchedUsersList$
        .pipe(take(1), throttleTime(100))
        .subscribe((entities) => {
          expect((comp as any).api.get).toHaveBeenCalledWith(
            'api/v2/search/suggest/user',
            {
              q: seachTerm,
              limit: (comp as any).limit,
              hydrate: 1,
              include_nsfw: 1,
            }
          );
          expect(entities).toEqual([userMock]);
          done();
        });
    });

    it('should get results from server without nsfw included when a user opts out of nsfw', (done: DoneFn) => {
      const seachTerm: string = 'username_test';
      (comp as any).api.get.and.returnValue(of({ entities: [userMock] }));
      (comp as any).session.getLoggedInUser.and.returnValue({
        ...userMock,
        mature: 0,
      });
      comp.username$$.next(seachTerm);

      comp.matchedUsersList$
        .pipe(take(1), throttleTime(100))
        .subscribe((entities) => {
          expect((comp as any).api.get).toHaveBeenCalledWith(
            'api/v2/search/suggest/user',
            {
              q: seachTerm,
              limit: (comp as any).limit,
              hydrate: 1,
              include_nsfw: 0,
            }
          );
          expect(entities).toEqual([userMock]);
          done();
        });
    });

    it('should get results from server without nsfw included when a user is not logged in', (done: DoneFn) => {
      const seachTerm: string = 'username_test';
      (comp as any).api.get.and.returnValue(of({ entities: [userMock] }));
      (comp as any).session.getLoggedInUser.and.returnValue(null);

      comp.username$$.next(seachTerm);

      comp.matchedUsersList$
        .pipe(take(1), throttleTime(100))
        .subscribe((entities) => {
          expect((comp as any).api.get).toHaveBeenCalledWith(
            'api/v2/search/suggest/user',
            {
              q: seachTerm,
              limit: (comp as any).limit,
              hydrate: 1,
              include_nsfw: 0,
            }
          );
          expect(entities).toEqual([userMock]);
          done();
        });
    });
  });
});
