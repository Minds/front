import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatRoomsListPageComponent } from './rooms-list-page.component';
import { CommonModule as NgCommonModule } from '@angular/common';
import { MockComponent } from '../../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';

describe('ChatRequestsPageComponent', () => {
  let comp: ChatRoomsListPageComponent;
  let fixture: ComponentFixture<ChatRoomsListPageComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [ChatRoomsListPageComponent],
    }).overrideComponent(ChatRoomsListPageComponent, {
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

    fixture = TestBed.createComponent(ChatRoomsListPageComponent);
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
      fixture.nativeElement.querySelector('m-chat__roomList')
    ).toBeTruthy();
    expect(fixture.nativeElement.querySelector('router-outlet')).toBeTruthy();
  });
});
