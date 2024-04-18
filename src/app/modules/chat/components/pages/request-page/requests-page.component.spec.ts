import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatRequestsPageComponent } from './requests-page.component';
import { CommonModule as NgCommonModule } from '@angular/common';
import { MockComponent } from '../../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';

describe('ChatRequestsPageComponent', () => {
  let comp: ChatRequestsPageComponent;
  let fixture: ComponentFixture<ChatRequestsPageComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [ChatRequestsPageComponent],
    }).overrideComponent(ChatRequestsPageComponent, {
      set: {
        imports: [
          NgCommonModule,
          RouterTestingModule,
          MockComponent({
            selector: 'm-chat__pageLayout',
            template: '<ng-content></ng-content>',
            standalone: true,
          }),
          MockComponent({
            selector: 'm-chat__requestList',
            standalone: true,
          }),
        ],
      },
    });

    fixture = TestBed.createComponent(ChatRequestsPageComponent);
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

  it('should init', () => {
    expect(comp).toBeTruthy();

    expect(
      fixture.nativeElement.querySelector('m-chat__pageLayout')
    ).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector('m-chat__requestList')
    ).toBeTruthy();
    expect(fixture.nativeElement.querySelector('router-outlet')).toBeTruthy();
  });
});
