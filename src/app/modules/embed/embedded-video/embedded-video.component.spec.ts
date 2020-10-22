import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxRequest, NgxResponse } from '@gorniv/ngx-universal';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { SERVER_PROVIDERS } from '../../../app.server.module';
import { EmbedModule } from '../embed.module';

import { EmbeddedVideoComponent } from './embedded-video.component';

describe('EmbeddedVideoComponent', () => {
  let component: EmbeddedVideoComponent;
  let fixture: ComponentFixture<EmbeddedVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmbeddedVideoComponent],
      providers: [
        ...SERVER_PROVIDERS,
        {
          provide: REQUEST,
          useValue: {},
        },
        {
          provide: RESPONSE,
          useValue: {},
        },
        {
          provide: NgxRequest,
          useValue: {},
        },
        {
          provide: NgxResponse,
          useValue: {},
        },
        { provide: 'ORIGIN_URL', useValue: location.origin },
        {
          provide: 'QUERY_STRING',
          useFactory: () => '',
        },
      ],
      imports: [EmbedModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbeddedVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
