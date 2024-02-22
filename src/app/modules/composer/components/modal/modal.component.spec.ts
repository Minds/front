import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent, MockService } from '../../../../utils/mock';
import { ModalComponent } from './modal.component';
import { ComposerService } from '../../services/composer.service';

describe('Composer Modal', () => {
  let comp: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          ModalComponent,
          MockComponent({
            selector: 'm-icon',
            inputs: ['from', 'iconId', 'sizeFactor'],
          }),
          MockComponent(
            {
              selector: 'm-composer__base',
              outputs: ['onPost'],
            },
            ['focus']
          ),
        ],
        providers: [
          {
            provide: ComposerService,
            useValue: MockService(ComposerService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    fixture = TestBed.createComponent(ModalComponent);
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

  it('should render a base composer', () => {
    fixture.detectChanges();

    const baseComposer = fixture.debugElement.query(By.css('m-composer__base'));
    expect(baseComposer).not.toBeNull();
  });
});
