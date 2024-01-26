import {
  ComponentFixture,
  TestBed,
  discardPeriodicTasks,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormControl, FormsModule, NgControl } from '@angular/forms';
import { ApiService } from '../../../api/api.service';
import {
  AutoCompleteEntityTypeEnum,
  AutocompleteEntityInputComponent,
} from './autocomplete-entity-input.component';
import { MockService } from '../../../../utils/mock';
import userMock from '../../../../mocks/responses/user.mock';
import { of, take } from 'rxjs';
import { groupMock } from '../../../../mocks/responses/group.mock';

describe('AutocompleteEntityInputComponent', () => {
  let comp: AutocompleteEntityInputComponent;
  let fixture: ComponentFixture<AutocompleteEntityInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [AutocompleteEntityInputComponent],
      providers: [
        { provide: NgControl, useValue: NgControl },
        { provide: ApiService, useValue: MockService(ApiService) },
      ],
    })
      .overrideComponent(AutocompleteEntityInputComponent, {
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
    fixture = TestBed.createComponent(AutocompleteEntityInputComponent);
    comp = fixture.componentInstance;

    comp.entityRef$.next(null);

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
      comp.entityRef$.next(userMock);

      tick();
      expect(comp.propagateChange).toHaveBeenCalledWith(userMock);
      discardPeriodicTasks();
    }));
  });

  describe('showPopout$', () => {
    it('should show popout because focused and has entities', fakeAsync((
      done: DoneFn
    ) => {
      (comp as any).api.get.and.returnValue(
        of({
          entities: [userMock],
        })
      );

      comp.inProgress$.next(false);
      comp.isFocused$.next(true);

      tick(100);
      comp.showPopout$.pipe(take(1)).subscribe(showPopout => {
        expect(showPopout).toBe(true);
        done();
      });
    }));
  });

  describe('entitySelection', () => {
    let mockApiService: ApiService;

    beforeEach(() => {
      mockApiService = TestBed.inject(ApiService);
      comp.propagateChange = jasmine.createSpy('propagateChange');
    });

    it('should propagate change when a group is selected', fakeAsync(() => {
      comp.entityType = AutoCompleteEntityTypeEnum.Group;
      (comp as any).api.get.and.returnValue(of({ entities: [groupMock] }));

      comp.onEntitySelect(groupMock);

      tick();
      expect(comp.propagateChange).toHaveBeenCalledWith(groupMock);
      discardPeriodicTasks();
    }));

    it('should propagate change when a user is selected', fakeAsync(() => {
      comp.entityType = AutoCompleteEntityTypeEnum.User;
      (comp as any).api.get.and.returnValue(of({ entities: [userMock] }));

      comp.onEntitySelect(userMock);

      tick();
      expect(comp.propagateChange).toHaveBeenCalledWith(userMock);
      discardPeriodicTasks();
    }));
  });

  describe('clearAfterSelection', () => {
    it('should clear the input field after a selection is made', fakeAsync(() => {
      comp.clearAfterSelection = true;
      comp.entityRef$.next(userMock);

      tick();
      fixture.detectChanges();

      expect(comp.inputElRef.nativeElement.value).toBe('');
      discardPeriodicTasks();
    }));
  });
});
