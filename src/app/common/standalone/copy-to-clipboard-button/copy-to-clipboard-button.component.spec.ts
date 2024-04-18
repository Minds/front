import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CopyToClipboardButtonComponent } from './copy-to-clipboard-button.component';
import { ToasterService } from '../../services/toaster.service';
import { By } from '@angular/platform-browser';

describe('CopyToClipboardButtonComponent', () => {
  let component: CopyToClipboardButtonComponent;
  let fixture: ComponentFixture<CopyToClipboardButtonComponent>;
  let toasterServiceSpy: jasmine.SpyObj<ToasterService>;

  beforeEach(async () => {
    const toasterSpy = jasmine.createSpyObj('ToasterService', ['success']);

    await TestBed.configureTestingModule({
      imports: [CopyToClipboardButtonComponent],
      providers: [{ provide: ToasterService, useValue: toasterSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(CopyToClipboardButtonComponent);
    component = fixture.componentInstance;
    toasterServiceSpy = TestBed.inject(
      ToasterService
    ) as jasmine.SpyObj<ToasterService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit onCopiedToClipboard event and show success message when copyToClipboard is called', () => {
    spyOn(document, 'execCommand');
    const emitSpy = spyOn(component.onCopiedToClipboard, 'emit');

    component.contentToCopy = 'Test content';
    component.copyToClipboard();

    expect(document.execCommand).toHaveBeenCalledWith('copy');
    expect(emitSpy).toHaveBeenCalled();
    expect(toasterServiceSpy.success).toHaveBeenCalledWith(
      component.successMessage
    );
  });

  it('should display the button text', () => {
    const buttonText = 'Click me';
    component.buttonText = buttonText;
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(
      By.css('.m-copyToClipboardButton')
    ).nativeElement;
    expect(buttonElement.textContent).toContain(buttonText);
  });
});
