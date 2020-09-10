import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { ComposerTitleBarDropdownComponent } from './dropdown.component';
import { ComposerService } from '../../../services/composer.service';

describe('Composer Title Bar Dropdown', () => {
  let comp: ComposerTitleBarDropdownComponent;
  let fixture: ComponentFixture<ComposerTitleBarDropdownComponent>;

  const accessId$ = jasmine.createSpyObj('accessId$', ['next']);
  const license$ = jasmine.createSpyObj('license$', ['next']);

  let containerGuid;

  const composerServiceMock: any = MockService(ComposerService, {
    getContainerGuid: () => containerGuid,
    has: ['accessId$', 'license$'],
    props: {
      accessId$: { get: () => accessId$ },
      license$: { get: () => license$ },
    },
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ComposerTitleBarDropdownComponent,
        MockComponent({
          selector: 'm-dropdownMenu',
          inputs: ['menu', 'triggerClass', 'menuClass', 'anchorPosition'],
        }),
        MockComponent({
          selector: 'm-icon',
          inputs: ['from', 'iconId', 'sizeFactor'],
        }),
      ],
      providers: [
        {
          provide: ComposerService,
          useValue: composerServiceMock,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    fixture = TestBed.createComponent(ComposerTitleBarDropdownComponent);
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

  it('should emit on visibility change', () => {
    containerGuid = '';
    accessId$.next.calls.reset();
    fixture.detectChanges();

    comp.onVisibilityClick('2');
    expect(accessId$.next).toHaveBeenCalledWith('2');
  });

  it('should not emit visibility change if disabled', () => {
    containerGuid = '100000';
    accessId$.next.calls.reset();
    fixture.detectChanges();

    comp.onVisibilityClick('2');
    expect(accessId$.next).not.toHaveBeenCalled();
  });

  it('should emit on license change', () => {
    license$.next.calls.reset();
    fixture.detectChanges();

    comp.onLicenseClick('spec-test');
    expect(license$.next).toHaveBeenCalledWith('spec-test');
  });
});
