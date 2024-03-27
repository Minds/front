import {
  ComponentFixture,
  TestBed,
  discardPeriodicTasks,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../api/api.service';
import { MockService } from '../../../../utils/mock';
import { EntityTypeaheadComponent } from './entity-typeahead.component';
import { Session } from '../../../../services/session';
import { MindsUser } from '../../../../interfaces/entities';
import userMock from '../../../../mocks/responses/user.mock';
import { of } from 'rxjs';

const mockEntities: MindsUser[] = [
  { guid: 123, ...userMock },
  { guid: 234, ...userMock },
  { guid: 345, ...userMock },
];

describe('EntityTypeaheadComponent', () => {
  let comp: EntityTypeaheadComponent;
  let fixture: ComponentFixture<EntityTypeaheadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, EntityTypeaheadComponent],
      providers: [
        { provide: ApiService, useValue: MockService(ApiService) },
        { provide: Session, useValue: MockService(Session) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityTypeaheadComponent);
    comp = fixture.componentInstance;

    (comp as any).propagateChange = jasmine.createSpy('propagateChange');
    (comp as any).filterSelf = false;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should get results from server', fakeAsync(() => {
    const seachTerm: string = 'username_test';
    (comp as any).formGroup.get('searchTerm').setValue(seachTerm);

    (comp as any).api.get.and.returnValue(of({ entities: mockEntities }));

    tick(100);

    expect((comp as any).api.get).toHaveBeenCalledWith(
      'api/v2/search/suggest/user',
      {
        q: seachTerm,
        limit: (comp as any).limit,
        hydrate: 1,
      }
    );
    expect(comp.propagateChange).toHaveBeenCalledWith(mockEntities);
    discardPeriodicTasks();
  }));

  it('should get results from server and filter self', fakeAsync(() => {
    (comp as any).filterSelf = true;
    const seachTerm: string = 'username_test';
    (comp as any).formGroup.get('searchTerm').setValue(seachTerm);

    (comp as any).api.get.and.returnValue(of({ entities: mockEntities }));
    (comp as any).session.getLoggedInUser.and.returnValue({
      guid: mockEntities[0].guid,
    });
    tick(100);

    expect((comp as any).api.get).toHaveBeenCalledWith(
      'api/v2/search/suggest/user',
      {
        q: seachTerm,
        limit: (comp as any).limit,
        hydrate: 1,
      }
    );
    expect(comp.propagateChange).toHaveBeenCalledWith(
      mockEntities.filter(
        (entity: MindsUser) => entity.guid !== mockEntities[0].guid
      )
    );
    discardPeriodicTasks();
  }));
});
