import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExplicitOverlayComponent } from './overlay.component';
import { Session } from '../../../services/session';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { Storage } from '../../../services/storage';
import { Router } from '@angular/router';
import { storageMock } from '../../../../tests/storage-mock.spec';
import { ConfigsService } from '../../services/configs.service';
import { MockService } from '../../../utils/mock';

let routerMock = new (function() {
  this.navigate = jasmine.createSpy('navigate');
})();

describe('OverlayComponent', () => {
  let comp: ExplicitOverlayComponent;
  let fixture: ComponentFixture<ExplicitOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExplicitOverlayComponent],
      imports: [],
      providers: [
        { provide: Storage, useValue: storageMock },
        { provide: Session, useValue: sessionMock },
        { provide: Router, useValue: routerMock },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
      ],
    }).compileComponents();
  }));

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    fixture = TestBed.createComponent(ExplicitOverlayComponent);
    comp = fixture.componentInstance;

    comp.hidden = true;

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

  it('should not show overlay when mature visibility is set', () => {
    comp.entity = {
      mature_visibility: true,
    };
    comp.showOverlay();
    fixture.detectChanges();
    expect(comp.hidden).toBeTruthy();
  });

  it('should overlay when entity is mature', () => {
    comp._entity = {
      is_mature: true,
    };
    comp.showOverlay();
    fixture.detectChanges();
    expect(comp.hidden).toBeFalsy();
  });

  it('should overlay when entity is nsfw for one reason', () => {
    comp._entity = {
      nsfw: [1],
    };
    comp.showOverlay();
    fixture.detectChanges();
    expect(comp.hidden).toBeFalsy();
  });

  it('should overlay when entity is nsfw for multiple reason', () => {
    comp._entity = {
      nsfw: [1, 2, 3],
    };
    comp.showOverlay();
    fixture.detectChanges();
    expect(comp.hidden).toBeFalsy();
  });

  it('should overlay when entity has nsfw_lock for one reason', () => {
    comp._entity = {
      nsfw_lock: [1],
    };
    comp.showOverlay();
    fixture.detectChanges();
    expect(comp.hidden).toBeFalsy();
  });

  it('should overlay when entity has nsfw_lock for multiple reasons', () => {
    comp._entity = {
      nsfw_lock: [1, 2, 3],
    };
    comp.showOverlay();
    fixture.detectChanges();
    expect(comp.hidden).toBeFalsy();
  });

  it('should have type `channel` when entity is a user', () => {
    comp.entity = {
      type: 'user',
    };
    comp.showOverlay();
    fixture.detectChanges();
    expect(comp.type).toBe('channel');
  });

  it('should have type `group` when entity is a group', () => {
    comp.entity = {
      type: 'group',
    };
    comp.showOverlay();
    fixture.detectChanges();
    expect(comp.type).toBe('group');
  });

  it('should overlay not show overlay if entity is not nsfw, mature and no mature_visibility', () => {
    comp._entity = {
      mature_visibility: false,
      is_mature: false,
      nsfw: [],
    };
    comp.showOverlay();
    fixture.detectChanges();
    expect(comp.hidden).toBeTruthy();
  });

  it('should not register undefined values as a false positive, and show the overlay', () => {
    comp._entity = {
      mature_visibility: undefined,
      is_mature: undefined,
      nsfw: undefined,
    };
    comp.showOverlay();
    fixture.detectChanges();
    expect(comp.hidden).toBeTruthy();
  });
});
