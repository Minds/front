import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ImageInputOrientationEnum,
  NetworkAdminConsoleImageInputComponent,
} from './image-input.component';
import { MockComponent } from '../../../../../utils/mock';

describe('NetworkAdminConsoleImageInputComponent', () => {
  let comp: NetworkAdminConsoleImageInputComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleImageInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NetworkAdminConsoleImageInputComponent],
      declarations: [
        MockComponent({
          selector: 'm-sizeableLoadingSpinner',
          inputs: ['inProgress', 'spinnerWidth', 'spinnerHeight'],
        }),
      ],
    });

    fixture = TestBed.createComponent(NetworkAdminConsoleImageInputComponent);
    comp = fixture.componentInstance;
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should emit on file change', () => {
    spyOn(comp.onFileChangeEmitter, 'emit');
    const file: File = new File([], 'test');
    comp.upload(file);
    expect(comp.onFileChangeEmitter.emit).toHaveBeenCalledWith(file);
  });

  it('should have upload icon when not in progress', () => {
    comp.inProgress = false;
    fixture.detectChanges();

    const iconElement: HTMLElement = fixture.nativeElement.querySelector(
      'i.m-networkAdmin__imageInputUploadLogo'
    );
    expect(iconElement).toBeTruthy();

    const spinnerElement: HTMLElement = fixture.nativeElement.querySelector(
      'm-sizeableLoadingSpinner'
    );
    expect(spinnerElement).toBeFalsy();
  });

  it('should have loading spinner when not in progress', () => {
    comp.inProgress = true;
    fixture.detectChanges();

    const spinnerElement: HTMLElement = fixture.nativeElement.querySelector(
      'm-sizeableLoadingSpinner'
    );
    expect(spinnerElement).toBeTruthy();

    const iconElement: HTMLElement = fixture.nativeElement.querySelector(
      'i.m-networkAdmin__imageInputUploadLogo'
    );
    expect(iconElement).toBeFalsy();
  });

  it('should have horizontal orientation class when orientation is horizontal', () => {
    comp.type = ImageInputOrientationEnum.Horizontal;
    fixture.detectChanges();

    const horizontalElement: HTMLElement = fixture.nativeElement.querySelector(
      '.m-networkAdmin__imageInputArea.m-networkAdmin__imageInputArea--horizontal'
    );
    expect(horizontalElement).toBeTruthy();

    const squareElement: HTMLElement = fixture.nativeElement.querySelector(
      '.m-networkAdmin__imageInputArea.m-networkAdmin__imageInputArea--square'
    );
    expect(squareElement).toBeFalsy();
  });

  it('should have square orientation class when orientation is square', () => {
    comp.type = ImageInputOrientationEnum.Square;
    fixture.detectChanges();

    const squareElement: HTMLElement = fixture.nativeElement.querySelector(
      '.m-networkAdmin__imageInputArea.m-networkAdmin__imageInputArea--square'
    );
    expect(squareElement).toBeTruthy();

    const horizontalElement: HTMLElement = fixture.nativeElement.querySelector(
      '.m-networkAdmin__imageInputArea.m-networkAdmin__imageInputArea--horizontal'
    );
    expect(horizontalElement).toBeFalsy();
  });
});
