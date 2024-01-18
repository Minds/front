import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminConsoleMobileReleaseComponent } from './release.component';
import { MockComponent, MockService } from '../../../../../../../utils/mock';
import { ChatwootWidgetService } from '../../../../../../../common/components/chatwoot-widget/chatwoot-widget.service';

describe('NetworkAdminConsoleMobileReleaseComponent', () => {
  let comp: NetworkAdminConsoleMobileReleaseComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleMobileReleaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NetworkAdminConsoleMobileReleaseComponent,
        MockComponent({
          selector: 'm-button',
          inputs: ['solid', 'stretch', 'color'],
          outputs: ['onAction'],
        }),
      ],
      providers: [
        {
          provide: ChatwootWidgetService,
          useValue: MockService(ChatwootWidgetService),
        },
      ],
    });

    fixture = TestBed.createComponent(
      NetworkAdminConsoleMobileReleaseComponent
    );
    comp = fixture.componentInstance;
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should call to toggle chatwoot window', () => {
    comp.onContactSupportClick();
    expect(
      (comp as any).chatwootWidgetService.toggleChatWindow
    ).toHaveBeenCalled();
  });
});
