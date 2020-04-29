import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { GetMetamaskComponent } from './getmetamask.component';
import { ConfigsService } from '../../../common/services/configs.service';
import { MockService } from '../../../utils/mock';

describe('GetMetamaskComponent', () => {
  let comp: GetMetamaskComponent;
  let fixture: ComponentFixture<GetMetamaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GetMetamaskComponent],
      providers: [
        {
          provide: ConfigsService,
          useValue: MockService(ConfigsService),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;

    fixture = TestBed.createComponent(GetMetamaskComponent);

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

  it('should have a title', () => {
    const title = fixture.debugElement.query(By.css('.m-get-metamask--title'));
    expect(title).not.toBeNull();
  });

  it('should raise a create address event', () => {
    spyOn(comp.actioned, 'emit').and.callThrough();
    const link = fixture.debugElement.query(
      By.css('.m-get-metamask--create-link')
    );
    link.nativeElement.click();
    expect(comp.actioned.emit).toHaveBeenCalledWith(
      GetMetamaskComponent.ACTION_CREATE
    );
  });

  it('should raise an provide address event', () => {
    spyOn(comp.actioned, 'emit').and.callThrough();
    const link = fixture.debugElement.query(
      By.css('.m-get-metamask--provide-link')
    );
    link.nativeElement.click();
    expect(comp.actioned.emit).toHaveBeenCalledWith(
      GetMetamaskComponent.ACTION_UNLOCK
    );
  });

  it('should raise a cancel', () => {
    spyOn(comp.actioned, 'emit').and.callThrough();
    const link = fixture.debugElement.query(
      By.css('.m-get-metamask--cancel-btn')
    );
    link.nativeElement.click();
    expect(comp.actioned.emit).toHaveBeenCalledWith(
      GetMetamaskComponent.ACTION_CANCEL
    );
  });
});
