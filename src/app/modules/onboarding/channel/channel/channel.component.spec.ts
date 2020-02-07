import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
} from '@angular/core/testing';
import { ChannelSetupOnboardingComponent } from './channel.component';
import { MockComponent } from '../../../../utils/mock';
import { Client } from '../../../../services/api/client';
import { clientMock } from '../../../../../tests/client-mock.spec';
import { Upload } from '../../../../services/api/upload';
import { uploadMock } from '../../../../../tests/upload-mock.spec';
import { Session } from '../../../../services/session';
import { sessionMock } from '../../../../../tests/session-mock.spec';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('ChannelSetupOnboardingComponent', () => {
  let comp: ChannelSetupOnboardingComponent;
  let fixture: ComponentFixture<ChannelSetupOnboardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        MockComponent({
          selector: 'minds-avatar',
          inputs: [
            'object',
            'src',
            'editMode',
            'waitForDoneSignal',
            'icon',
            'showPrompt',
          ],
          outputs: ['added'],
        }),
        ChannelSetupOnboardingComponent,
      ],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: Upload, useValue: uploadMock },
        { provide: Session, useValue: sessionMock },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(ChannelSetupOnboardingComponent);

    clientMock.response = {};

    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should allow to upload an avatar', () => {
    expect(fixture.debugElement.query(By.css('minds-avatar'))).not.toBeNull();
  });

  it("should allow to update the user's display name", fakeAsync(() => {
    const input: DebugElement = fixture.debugElement.query(
      By.css('input#display-name')
    );
    expect(input).not.toBeNull();

    clientMock.response['api/v1/channel/info'] = {
      status: 'success',
    };

    input.nativeElement.dispatchEvent(new Event('keyup'));

    jasmine.clock().tick(1010);

    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual({
      name: 'test',
    });
  }));

  it("should allow to update the user's brief description", fakeAsync(() => {
    const input: DebugElement = fixture.debugElement.query(
      By.css('input#description')
    );
    expect(input).not.toBeNull();

    clientMock.response['api/v1/channel/info'] = {
      status: 'success',
    };

    input.nativeElement.dispatchEvent(new Event('keyup'));

    jasmine.clock().tick(1010);

    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual({
      briefdescription: '',
    });
  }));
});
