import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { TransactionOverlayComponent } from './transaction-overlay.component';
import { TransactionOverlayService } from './transaction-overlay.service';
import { TokenContractService } from '../contracts/token-contract.service';
import { RouterTestingModule } from '@angular/router/testing';
import { transactionOverlayService } from '../../../mocks/modules/blockchain/transaction-overlay/transaction-overlay-service-mock';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MaterialSwitchMock } from '../../../../tests/material-switch-mock.spec';

describe('TransactionOverlayComponent', () => {

  let comp: TransactionOverlayComponent;
  let fixture: ComponentFixture<TransactionOverlayComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [MaterialSwitchMock, TransactionOverlayComponent], // declare the test component
      imports: [RouterTestingModule, FormsModule],
      providers: [
        { provide: TransactionOverlayService, useValue: transactionOverlayService },
        { provide: TokenContractService, useValue: TokenContractService }
      ]
    })
      .compileComponents();  // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionOverlayComponent);

    comp = fixture.componentInstance;

    window.Minds.site_url = 'https://www.minds.com/';

    fixture.detectChanges();
  });

  it('should have a title', () => {
    expect(fixture.debugElement.query(By.css('.m--blockchain--transaction-overlay--title'))).not.toBeNull();
  });
  it('note content on non-unlock modal should come from a variable', () => {
    comp.comp = comp.COMP_LOCAL;
    comp.message = 'Testing';
    comp.detectChanges(); // For some reason we have to call this as well
    fixture.detectChanges();
    const note: DebugElement = fixture.debugElement.query(By.css('.m--blockchain--transaction-overlay--note'));
    expect(note.nativeElement.textContent.trim()).toContain('Testing');
  });

  xit('should have a link that says \'Having Issues?\' that redirects to /coin page', () => {
    const havingIssues: DebugElement = fixture.debugElement.query(By.css('.m--blockchain--transaction-overlay--help > a'));
    expect(havingIssues).not.toBeNull();
    expect(havingIssues.nativeElement.href).toMatch(/https?:\/\/.*\/token/);
  });

});
