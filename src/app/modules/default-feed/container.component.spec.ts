import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { DefaultFeedContainerComponent } from './container.component';
import { PageLayoutService } from '../../common/layout/page-layout.service';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '../../common/common.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FeaturesService } from '../../services/features.service';
import { featuresServiceMock } from '../../../tests/features-service-mock.spec';
import { MockComponent, MockService } from '../../utils/mock';
import { FeedsService } from '../../common/services/feeds.service';

describe('DefaultFeedContainerComponent', () => {
  let comp: DefaultFeedContainerComponent;
  let fixture: ComponentFixture<DefaultFeedContainerComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          DefaultFeedContainerComponent,
          MockComponent({
            selector: 'm-defaultFeed',
          }),
          MockComponent({
            selector: 'm-discovery__disclaimer',
          }),
          MockComponent({
            selector: 'm-suggestions__sidebar',
          }),
        ],
        imports: [RouterTestingModule, ReactiveFormsModule, CommonModule],
        providers: [
          PageLayoutService,
          { provider: FeedsService, useValue: MockService(FeedsService) },
          { provide: FeaturesService, useValue: featuresServiceMock },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(DefaultFeedContainerComponent);
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

  it('should initialize', () => {
    expect(comp).toBeTruthy();
  });

  it('should have default feed component', () => {
    expect(By.css('m-defaultFeed')).toBeDefined();
  });

  it('should have discovery disclaimer', () => {
    expect(By.css('m-discovery__disclaimer')).toBeDefined();
  });

  it('should have suggestions sidebar component', () => {
    expect(By.css('m-suggestions__sidebar')).toBeDefined();
  });
});
