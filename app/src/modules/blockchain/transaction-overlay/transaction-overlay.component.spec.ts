import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { TransactionOverlayComponent } from './transaction-overlay.component';
import { TransactionOverlayService } from './transaction-overlay.service';
import { RouterTestingModule } from '@angular/router/testing';
import { transactionOverlayService } from '../../../mocks/modules/blockchain/transaction-overlay/transaction-overlay-service-mock';
import { By } from '@angular/platform-browser';

describe('TransactionOverlayComponent', () => {

  let comp: TransactionOverlayComponent;
  let fixture: ComponentFixture<TransactionOverlayComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [TransactionOverlayComponent], // declare the test component
      imports: [RouterTestingModule],
      providers: [
        { provide: TransactionOverlayService, useValue: transactionOverlayService }
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
  it('title content should come from a variable', () => {
    comp.title = 'Testing';
    fixture.detectChanges();
    const title: DebugElement = fixture.debugElement.query(By.css('.m--blockchain--transaction-overlay--title'));
    expect(title.nativeElement.textContent.trim()).toContain('Testing');
  });

  it('should have a subtitle', () => {
    const subtitle: DebugElement = fixture.debugElement.query(By.css('.m--blockchain--transaction-overlay--subtitle'));
    expect(subtitle).not.toBeNull();
    expect(subtitle.nativeElement.textContent.trim()).toContain('Please open your Metamask client to complete the transaction');
  });
  it('should have a note', () => {
    const note: DebugElement = fixture.debugElement.query(By.css('.m--blockchain--transaction-overlay--note'));
    expect(note).not.toBeNull();
    expect(note.nativeElement.textContent.trim()).toBe('NOTE: Your client will show 0 ETH as we use the Ethereum network, but XXXX Minds tokens will be sent.');
  });
  it('should have a link that says \'Having Issues?\' that redirects to /coin page', () => {
    const havingIssues: DebugElement = fixture.debugElement.query(By.css('.m--blockchain--transaction-overlay--help > a'));
    expect(havingIssues).not.toBeNull();
    expect(havingIssues.nativeElement.href).toBe('https://www.minds.com/coin');
  });

});
