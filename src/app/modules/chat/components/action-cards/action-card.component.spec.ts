import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatActionCardComponent } from './action-card.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { MockComponent } from '../../../../utils/mock';

describe('ChatActionCardComponent', () => {
  let comp: ChatActionCardComponent;
  let fixture: ComponentFixture<ChatActionCardComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [ChatActionCardComponent],
      declarations: [
        MockComponent({
          selector: 'm-button',
          inputs: ['color', 'size', 'solid'],
          outputs: ['onAction'],
        }),
      ],
    }).overrideComponent(ChatActionCardComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    });

    fixture = TestBed.createComponent(ChatActionCardComponent);
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

  it('should init with input values', () => {
    const headerText: string = 'headerText';
    const headerSize: number = 2;
    const descriptionText: string = 'descriptionText';
    const descriptionSize: number = 2;
    const ctaText: string = 'ctaText';

    (comp as any).headerText = headerText;
    (comp as any).headerSize = headerSize;
    (comp as any).descriptionText = descriptionText;
    (comp as any).descriptionSize = descriptionSize;
    (comp as any).ctaText = ctaText;

    fixture.detectChanges();
    expect(comp).toBeTruthy();

    expect(
      fixture.nativeElement.querySelector('.m-chatActionCard__title')
        .textContent
    ).toContain(headerText);

    expect(
      fixture.nativeElement.querySelector('.m-chatActionCard__title').classList
    ).toContain(`m-chatActionCard__title--size${headerSize}`);

    expect(
      fixture.nativeElement.querySelector('.m-chatActionCard__description')
        .textContent
    ).toContain(descriptionText);

    expect(
      fixture.nativeElement.querySelector('.m-chatActionCard__description')
        .classList
    ).toContain(`m-chatActionCard__description--size${descriptionSize}`);

    expect(
      fixture.nativeElement.querySelector('m-button').textContent
    ).toContain(ctaText);
  });
});
