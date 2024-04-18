import {
  ChangeDetectorRef,
  ComponentFactoryResolver,
  Injector,
  PLATFORM_ID,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { MockService } from '../../../utils/mock';
import { FeaturedContentComponent } from './featured-content.component';
import { FeaturedContentService } from './featured-content.service';

describe('FeaturedContentComponent', () => {
  let comp: FeaturedContentComponent;
  let fixture: ComponentFixture<FeaturedContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FeaturedContentComponent],
      providers: [
        {
          provide: FeaturedContentService,
          useValue: MockService(FeaturedContentService),
        },
        {
          provide: ComponentFactoryResolver,
          useValue: MockService(ComponentFactoryResolver),
        },
        {
          provide: ChangeDetectorRef,
          useValue: MockService(ChangeDetectorRef),
        },
        {
          provide: Injector,
          useValue: MockService(Injector),
        },
        {
          provide: PLATFORM_ID,
          useValue: 'browser',
        },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(FeaturedContentComponent);
    comp = fixture.componentInstance;

    (comp as any).featuredContentService.onInit.calls.reset();

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

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
    expect((comp as any).featuredContentService.onInit).toHaveBeenCalled();
    expect((comp as any).featuredContentService.fetch).toHaveBeenCalled();
  });

  it('should pass opts to featured content service', fakeAsync(() => {
    const servedByGuid: string = '123';
    comp.servedByGuid = servedByGuid;

    comp.ngOnInit();
    tick();

    expect((comp as any).featuredContentService.onInit).toHaveBeenCalledWith({
      servedByGuid: servedByGuid,
    });
  }));
});
