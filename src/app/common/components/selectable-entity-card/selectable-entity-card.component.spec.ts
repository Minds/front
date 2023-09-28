import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SelectableEntity,
  SelectableEntityCardComponent,
} from './selectable-entity-card.component';
import { CDN_URL } from '../../injection-tokens/url-injection-tokens';
import { Session } from '../../../services/session';
import { MockService } from '../../../utils/mock';
import { TruncatePipe } from '../../pipes/truncate.pipe';

describe('SelectableEntityCardComponent', () => {
  let comp: SelectableEntityCardComponent;
  let fixture: ComponentFixture<SelectableEntityCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectableEntityCardComponent, TruncatePipe],
      providers: [
        { provide: Session, useValue: MockService(Session) },
        { provide: CDN_URL, useValue: 'http://example.minds.com/' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectableEntityCardComponent);
    comp = fixture.componentInstance;
  });

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should initialize avatarSrc, title, and subtext on init', () => {
    const entity: SelectableEntity = {
      guid: '123',
      name: 'Test User',
      type: 'user',
      'members:count': 5,
    };
    comp.entity = entity;
    comp.ngOnInit();
    expect(comp.avatarSrc).toBeDefined();
    expect(comp.title).toBeDefined();
  });

  it('should return the correct avatar source for user', () => {
    comp.entity = { guid: '123', name: 'Test User', type: 'user' };
    const avatarSrc = comp.getAvatarSrc();
    expect(avatarSrc).toContain('http://example.minds.com/icon/123/large/');
  });

  it('should return the correct avatar source for group', () => {
    comp.entity = { guid: '234', name: 'Test Group', type: 'group' };
    const avatarSrc = comp.getAvatarSrc();
    expect(avatarSrc).toContain('http://example.minds.com/fs/v1/avatars/234/');
  });

  it('should return the correct title for a user', () => {
    comp.entity = { guid: '123', name: 'Test User', type: 'user' };
    const title = comp.getTitle();
    expect(title).toBe('My Channel');
  });

  it('should return the correct title for a group', () => {
    comp.entity = { guid: '123', name: 'Test Group', type: 'group' };
    const title = comp.getTitle();
    expect(title).toBe('Test Group');
  });
});
