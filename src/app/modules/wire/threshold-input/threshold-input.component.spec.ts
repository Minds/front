import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { WireThresholdInputComponent } from './threshold-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Client } from '../../../services/api/client';
import { By } from '@angular/platform-browser';
import { Session } from '../../../services/session';
import { clientMock } from '../../../../tests/client-mock.spec';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { TooltipComponentMock } from '../../../mocks/common/components/tooltip/tooltip.component';
import { DropdownComponent } from '../../../common/components/dropdown/dropdown.component';

describe('WireThresholdInputComponent', () => {

  let comp: WireThresholdInputComponent;
  let fixture: ComponentFixture<WireThresholdInputComponent>;

  function getDropdown(): DebugElement {
    return fixture.debugElement.query(By.css('m-dropdown.m-topbar--navigation--options'));
  }

  function clickDropdown() {
    fixture.debugElement.query(By.css('.m-dropdown--label-container')).nativeElement.click();

    fixture.detectChanges();
  }

  function setRewards(value: boolean) {
    const rewards = {
      "description": "rewards",
      "rewards": {
        "points": [],
        "money": [],
        "tokens": [
          {
            "amount": 3,
            "description": "test"
          }
        ]
      }
    };
    sessionMock.user['wire_rewards'] = value ? rewards: null;
  }

  function getInput(): DebugElement {
    return fixture.debugElement.query(By.css('ul li.m-dropdown--list--item:last-child input'));
  }

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        MaterialMock,
        TooltipComponentMock,
        DropdownComponent,
        WireThresholdInputComponent
      ], // declare the test component
      imports: [RouterTestingModule, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock }
      ]
    })
      .compileComponents();  // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 1;
    fixture = TestBed.createComponent(WireThresholdInputComponent);

    sessionMock.user = {
      "guid": "1234",
      "type": "user",
      "name": "minds",
      "username": "minds",
      "wire_rewards": {
        "description": "rewards",
        "rewards": {
          "points": [],
          "money": [],
          "tokens": [
            {
              "amount": 3,
              "description": "test"
            }
          ]
        }
      }
    };

    comp = fixture.componentInstance; // WireThresholdInputComponent test instance
    comp._threshold = {
      'type': 'tokens',
      'min': 0
    };
  });

  it('should have a m-dropdown', () => {
    expect(getDropdown()).not.toBeNull();
  });

  it('clicking on m-dropdown should open the threshold input', () => {
    clickDropdown();

    expect(fixture.debugElement.query(By.css('.m-wire-threshold-input--toggle'))).not.toBeNull();
  });

  it('should have a label with a tooltip', () => {
    clickDropdown();
    const label = fixture.debugElement.query(By.css('.m-wire-threshold-input--toggle'));
    const tooltip = fixture.debugElement.query(By.css('.m-wire-threshold-input--toggle m-tooltip'));

    expect(label).not.toBeNull();
    expect(tooltip).not.toBeNull();
  });

  it('should have a list of rewards', () => {
    clickDropdown();
    expect(fixture.debugElement.query(By.css('ul.m-dropdown--list'))).not.toBeNull();
  });

  it('should just prompt to enter the threshold if no channel rewards are set', () => {
    setRewards(false);
    clickDropdown();
    const p: DebugElement = fixture.debugElement.query(By.css('p.m-wire-threshold-input--info'));
    expect(p).not.toBeNull();
    expect(p.nativeElement.textContent).toContain('Enter how many tokens users should send you in order to see this post.');
  });

  it('should prompt to select from one of the rewards categories if channel rewards are set', () => {
    setRewards(true);
    clickDropdown();

    const p: DebugElement = fixture.debugElement.query(By.css('p.m-wire-threshold-input--info'));
    expect(p).not.toBeNull();
    expect(p.nativeElement.textContent).toContain('Select from one of your rewards or enter a custom amount of tokens to restrict who can see this post.');
  });

  it('should prompt to select from one of the rewards categories if channel rewards are set', () => {
    setRewards(true);
    clickDropdown();

    const p: DebugElement = fixture.debugElement.query(By.css('p.m-wire-threshold-input--info'));
    expect(p).not.toBeNull();
    expect(p.nativeElement.textContent).toContain('Select from one of your rewards or enter a custom amount of tokens to restrict who can see this post.');
  });

  it('should have one reward (from the channel rewards)', () => {
    setRewards(true);
    clickDropdown();

    const rewardItem: DebugElement = fixture.debugElement.query(By.css('li.m-dropdown--list--item:not(.m-dropdown--list--custom-threshold)'));
    const amount: DebugElement = fixture.debugElement.query(By.css('li.m-dropdown--list--item:not(.m-dropdown--list--custom-threshold) b'));
    const description: DebugElement = fixture.debugElement.query(By.css('li.m-dropdown--list--item:not(.m-dropdown--list--custom-threshold) p'));
    expect(rewardItem).not.toBeNull();

    expect(amount).not.toBeNull();
    expect(amount.nativeElement.textContent).toContain('3 Tokens and Over');

    expect(description).not.toBeNull();
    expect(description.nativeElement.textContent).toContain('test');
  });

  it('should select the min threshold to the reward item that was clicked', () => {
    setRewards(true);
    clickDropdown();
    spyOn(comp, 'selectTier').and.callThrough();


    const rewardItem: DebugElement = fixture.debugElement.query(By.css('li.m-dropdown--list--item'));
    rewardItem.nativeElement.click();

    expect(comp.selectTier).toHaveBeenCalled();
    expect(comp.threshold.min).toBe(3);
  });

  it('should have a reward item that allows a custom amount', () => {
    clickDropdown();

    const rewardItem: DebugElement = fixture.debugElement.query(By.css('ul li.m-dropdown--list--custom-threshold'));
    const text: DebugElement = fixture.debugElement.query(By.css('ul li.m-dropdown--list--custom-threshold b'));
    const span: DebugElement = fixture.debugElement.query(By.css('ul li.m-dropdown--list--custom-threshold span'));
    const done: DebugElement = fixture.debugElement.query(By.css('ul li.m-dropdown--list--custom-threshold i:not(.m-wire-threshold-input--type)'));

    expect(rewardItem).not.toBeNull();
    expect(text.nativeElement.textContent).toContain('Visible to supporters who send over');
    expect(getInput()).not.toBeNull();
    expect(span.nativeElement.textContent).toContain('Tokens');
    expect(done).not.toBeNull();
  });

  it("should change the threshold's min amount when changing the input", () => {
    comp._threshold = {
      'type': 'tokens',
      'min': 0
    };

    clickDropdown();

    const input = getInput().nativeElement;
    input.value = '10';
    input.dispatchEvent(new Event('input'));

    expect(comp.threshold.min).toBe(10);
  });

  it("should support threshold's min amount with decimals", () => {
    comp._threshold = {
      'type': 'tokens',
      'min': 0
    };

    clickDropdown();

    const input = getInput().nativeElement;
    input.value = '0.1';
    input.dispatchEvent(new Event('input'));

    expect(comp.threshold.min).toBe(0.1);

    input.value = '0.01';
    input.dispatchEvent(new Event('input'));

    expect(comp.threshold.min).toBe(0.01);
  });

  it("should support threshold's min amount with 3 decimals max", () => {
    comp._threshold = {
      'type': 'tokens',
      'min': 0
    };

    clickDropdown();

    const input = getInput().nativeElement;
    input.value = '0.001';
    input.dispatchEvent(new Event('input'));

    expect(comp.threshold.min).toBe(0.001);

    input.value = '0.0001';
    input.dispatchEvent(new Event('input'));

    expect(comp.threshold.min).toBe(0);
  });

  it("should close the dropdown when clicking on done", () => {
    clickDropdown();

    expect(fixture.debugElement.query(By.css('.m-dropdown--list-container')).nativeElement.hidden).toBeFalsy();

    const done: DebugElement = fixture.debugElement.query(By.css('ul li.m-dropdown--list--custom-threshold i:not(.m-wire-threshold-input--type)'));
    done.nativeElement.click();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.m-dropdown--list-container')).nativeElement.hidden).toBeTruthy();
  });


});
