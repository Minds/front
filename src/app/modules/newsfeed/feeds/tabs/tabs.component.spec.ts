import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NewsfeedTabsComponent } from './tabs.component';
import { MockService } from '../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { ExperimentsService } from '../../../experiments/experiments.service';

describe('NewsfeedTabsComponent', () => {
  let comp: NewsfeedTabsComponent;
  let fixture: ComponentFixture<NewsfeedTabsComponent>;

  /**
   * Get all tabs.
   * @returns { DebugElement[] } all tabs.
   */
  const getAllTabs = (): DebugElement[] =>
    fixture.debugElement.queryAll(By.css('.m-tabs__tab a'));

  /**
   * Get a specific tab by its text.
   * @param { string } text - text to get tab by.
   * @returns { DebugElement } - specific tab.
   */
  const getTabByText = (text: string): DebugElement =>
    getAllTabs().find((span: DebugElement): boolean =>
      span.nativeElement.textContent.includes(text)
    );

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [NewsfeedTabsComponent],
        providers: [
          {
            provide: ExperimentsService,
            useValue: MockService(ExperimentsService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(NewsfeedTabsComponent);
    comp = fixture.componentInstance;

    (comp as any).experimentsService.hasVariation.and.returnValue(true);

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
  });

  it('should have correct tabs when group experiment is on', () => {
    (comp as any).experimentsService.hasVariation.and.returnValue(true);
    comp.ngOnInit();
    fixture.detectChanges();

    expect((comp as any).experimentsService.hasVariation).toHaveBeenCalledWith(
      'minds-3990-group-feed'
    );
    expect(getTabByText('For You')).toBeDefined();
    expect(getTabByText('Top')).toBeDefined();
    expect(getTabByText('Latest')).toBeDefined();
    expect(getTabByText('Groups')).toBeDefined();
  });

  it('should have correct tabs when experiment is off', () => {
    (comp as any).experimentsService.hasVariation.and.returnValue(false);
    comp.ngOnInit();
    fixture.detectChanges();

    expect((comp as any).experimentsService.hasVariation).toHaveBeenCalledWith(
      'minds-3990-group-feed'
    );
    expect(getTabByText('For You')).toBeDefined();
    expect(getTabByText('Top')).toBeDefined();
    expect(getTabByText('Latest')).toBeDefined();
    expect(getTabByText('Groups')).toBeUndefined();
  });
});
