import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MindsDialogComponent } from './dialog.component';

describe('dialog', () => {
  let comp: MindsDialogComponent;
  let fixture: ComponentFixture<MindsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MindsDialogComponent],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(done => {
    fixture = TestBed.createComponent(MindsDialogComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  it('should open a dialog', () => {
    spyOn(comp.nativeDialogElement, 'showModal');
    comp.showDialog = true;
    comp.ngOnChanges();
    fixture.detectChanges();
    expect(comp.showDialog).toBeTruthy();
    expect(comp.nativeDialogElement.showModal).toHaveBeenCalled();
  });

  it('should close a dialog', () => {
    spyOn(comp.nativeDialogElement, 'close');
    comp.close();
    fixture.detectChanges();
    expect(comp.showDialog).toBeFalsy();
    expect(comp.nativeDialogElement.close).toHaveBeenCalled();
  });

  it('should confirm a dialog', () => {
    let confirmed = null;
    spyOn(comp.nativeDialogElement, 'close');
    comp.confirmed.subscribe((value: boolean) => (confirmed = value));
    comp.confirmClick();
    fixture.detectChanges();
    expect(comp.showDialog).toBeFalsy();
    expect(comp.nativeDialogElement.close).toHaveBeenCalled();
    expect(confirmed).toBeTruthy();
  });

  it('should cancel a dialog', () => {
    let confirmed = null;
    spyOn(comp.nativeDialogElement, 'close');
    comp.confirmed.subscribe((value: boolean) => (confirmed = value));
    comp.cancelClick();
    fixture.detectChanges();
    expect(comp.showDialog).toBeFalsy();
    expect(comp.nativeDialogElement.close).toHaveBeenCalled();
    expect(confirmed).toBeFalsy();
  });
});
