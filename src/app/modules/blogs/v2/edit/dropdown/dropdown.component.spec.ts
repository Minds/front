import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BlogEditorDropdownComponent } from './dropdown.component';
import { FormsModule } from '@angular/forms';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { BlogsEditService } from '../blog-edit.service';
import { BehaviorSubject } from 'rxjs';
import { NsfwEnabledService } from '../../../../multi-tenant-network/services/nsfw-enabled.service';

const license$ = new BehaviorSubject<string>('');

const accessId$ = new BehaviorSubject<string>('');

const nsfw$ = new BehaviorSubject<string>('');

const blogsEditServiceMock: any = MockService(BlogsEditService, {
  has: ['license$', 'accessId$', 'nsfw$'],
  props: {
    license$: { get: () => license$ },
    accessId$: { get: () => accessId$ },
    nsfw$: { get: () => nsfw$ },
  },
});

describe('BlogEditorDropdownComponent', () => {
  let comp: BlogEditorDropdownComponent;
  let fixture: ComponentFixture<BlogEditorDropdownComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          BlogEditorDropdownComponent,
          MockComponent({
            selector: 'm-composerTitleBar__dropdown',
            inputs: ['anchorPosition'],
          }),
          MockComponent({
            selector: 'm-dropdownMenu',
            inputs: ['anchorPosition', 'menu'],
          }),
          MockComponent({
            selector: 'm-icon',
          }),
        ],
        imports: [RouterTestingModule, NgCommonModule, FormsModule],
        providers: [
          { provide: BlogsEditService, useValue: blogsEditServiceMock },
          {
            provide: NsfwEnabledService,
            useValue: MockService(NsfwEnabledService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    fixture = TestBed.createComponent(BlogEditorDropdownComponent);

    comp = fixture.componentInstance; // BlogEditorDropdownComponent test instance

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

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  // it('should set and get license, and toggle off when value exists', () => {
  //   comp.setLicense('1');
  //   expect(comp.getLicense().getValue()).toBe('1');
  //   comp.setLicense('1');
  //   expect(comp.getLicense().getValue()).toBe('');
  // });

  // it('should set and get access id, and toggle off when value exists', () => {
  //   comp.setAccessId(1);
  //   expect(comp.getAccessId().getValue()).toBe(1);
  //   comp.setAccessId(1);
  //   expect(comp.getAccessId().getValue()).toBe(null);
  // });

  it('should set and get nsfw', () => {
    comp.toggleNSFW(1);
    expect((comp as any).editService.toggleNSFW).toHaveBeenCalledWith(1);
  });
});
