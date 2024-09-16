import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalDotComOpenButtonComponent } from './caldotcom-open-button';
import { CalDotComService } from './caldotcom.service';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('CalDotComOpenButtonComponent', () => {
  let comp: CalDotComOpenButtonComponent;
  let fixture: ComponentFixture<CalDotComOpenButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalDotComOpenButtonComponent],
      providers: [
        {
          provide: CalDotComService,
          useValue: MockService(CalDotComService),
        },
      ],
    })
      .overrideComponent(CalDotComOpenButtonComponent, {
        set: {
          imports: [
            CommonModule,
            MockComponent({
              selector: 'm-button',
              inputs: ['color', 'solid', 'saving', 'disabled'],
              outputs: ['click'],
              template: '<button></button>',
              standalone: true,
            }),
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalDotComOpenButtonComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
    expect((comp as any).calDotComService.loadScript).toHaveBeenCalled();
    expect(
      (comp as any).calDotComService.initializeCalendar
    ).toHaveBeenCalledWith('30min');
  });

  it('should render button', () => {
    const button: DebugElement = fixture.debugElement.query(By.css('m-button'));
    expect(button).toBeTruthy();
    expect(button.attributes['data-cal-link']).toBe('mindsnetworks/30min');
    expect(button.attributes['data-cal-namespace']).toBe('30min');
    expect(button.attributes['data-cal-config']).toBe(
      '{"layout":"month_view"}'
    );
  });
});
