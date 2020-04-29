import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';
import { PagesService } from '../../services/pages.service';
import { MockComponent, MockService } from '../../../utils/mock';
import { Navigation as NavigationService } from '../../../services/navigation';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FooterComponent,
        MockComponent({
          selector: 'a',
          inputs: ['routerLink'],
        }),
      ],
      providers: [
        {
          provide: NavigationService,
          useValue: MockService(NavigationService),
        },
        { provide: PagesService, useValue: MockService(PagesService) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
