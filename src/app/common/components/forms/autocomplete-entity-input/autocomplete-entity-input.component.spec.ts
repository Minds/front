import {
  ComponentFixture,
  TestBed,
  discardPeriodicTasks,
  fakeAsync,
  flush,
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

    it('should propagate change out when entityRef$ is updated with a username', fakeAsync(() => {
      comp.entityType = AutoCompleteEntityTypeEnum.User;
      (comp as any).api.get.and.returnValue(
        of({
          entities: [userMock],
        })
      );

      comp.entityRef$.next(userMock.username);

      tick(100);
      expect((comp as any).api.get).toHaveBeenCalled();
      expect(comp.propagateChange).toHaveBeenCalledWith(userMock);
      discardPeriodicTasks();
    }));

    it('should propagate change out when entityRef$ is updated with a group name', fakeAsync(() => {
      comp.entityType = AutoCompleteEntityTypeEnum.Group;
      (comp as any).api.get.and.returnValue(
        of({
          entities: [groupMock],
        })
      );

      comp.entityRef$.next(groupMock.name);

      tick(100);
      expect((comp as any).api.get).toHaveBeenCalled();
      expect(comp.propagateChange).toHaveBeenCalledWith(groupMock);
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
        expect(showPopout).toBe(false);
        done();
      });
    }));
  });
});
