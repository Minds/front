import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FileUploadComponent } from './file-upload.component';
import fileMock from '../../../mocks/dom/file.mock';
import createSpy = jasmine.createSpy;

describe('File Upload', () => {
  let comp: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FileUploadComponent],
    }).compileComponents();
  }));

  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    fixture = TestBed.createComponent(FileUploadComponent);
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

  it('should emit on select', () => {
    const file = new File([], '');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    spyOnProperty(fileInput, 'files', 'get').and.returnValue([file]);
    spyOn(comp.onSelectEmitter, 'emit').and.callFake(() => {});
    fixture.detectChanges();

    comp.onSelect(fileInput);
    expect(comp.onSelectEmitter.emit).toHaveBeenCalledWith(file);
  });

  it('should reset the form', () => {
    spyOn(comp.fileForm.nativeElement, 'reset').and.callFake(() => {});
    fixture.detectChanges();

    comp.reset();
    expect(comp.fileForm.nativeElement.reset).toHaveBeenCalled();
  });
});
