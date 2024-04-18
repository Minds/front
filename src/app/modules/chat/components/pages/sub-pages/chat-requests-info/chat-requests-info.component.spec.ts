import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatRequestsInfoSubPageComponent } from './chat-requests-info.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from '../../../../../../utils/mock';
import { CommonModule as NgCommonModule } from '@angular/common';

describe('ChatRequestsInfoSubPageComponent', () => {
  let comp: ChatRequestsInfoSubPageComponent;
  let fixture: ComponentFixture<ChatRequestsInfoSubPageComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [ChatRequestsInfoSubPageComponent],
    }).overrideComponent(ChatRequestsInfoSubPageComponent, {
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
            selector: 'm-chat__roomList',
            standalone: true,
          }),
        ],
      },
    });

    fixture = TestBed.createComponent(ChatRequestsInfoSubPageComponent);
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
  });
});
