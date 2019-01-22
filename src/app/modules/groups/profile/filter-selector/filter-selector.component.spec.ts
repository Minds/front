import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsProfileFilterSelector } from './filter-selector.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { MockService } from '../../../../utils/mock';
import { VideoChatService } from '../../../videochat/videochat.service';

let videoChatServiceMock = MockService(VideoChatService);

describe('GroupsProfileFilterSelector', () => {

  let comp: GroupsProfileFilterSelector;
  let fixture: ComponentFixture<GroupsProfileFilterSelector>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [GroupsProfileFilterSelector],
      providers: [
        { provide: VideoChatService, useValue: videoChatServiceMock }
      ],
      imports: [RouterTestingModule, ReactiveFormsModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsProfileFilterSelector);

    comp = fixture.componentInstance;

    comp.group = {
      guid: 123
    };

    comp.filter = 'activity';

    fixture.detectChanges();
  });

  it('should wrap everything inside a div', () => {
    const div = fixture.debugElement.query(By.css('.m-groups--filter-selector'));

    expect(div).not.toBeNull();

    expect(div.nativeElement.children.length).toBe(3);
  });

  it('should have a link to feed', () => {
    const a = fixture.debugElement.query(By.css('.m-groups--filter-selector-item:first-child'));
    expect(a).not.toBeNull();

    expect(a.nativeElement.textContent).toContain('Feed');
    expect(a.nativeElement.href).toContain('/groups/profile/123/feed');
    expect(a.nativeElement.classList).toContain('m-groups--filter-selector-active')
  });

  it('should have a link to images', () => {
    comp.filter = 'image';
    fixture.detectChanges();

    const a = fixture.debugElement.query(By.css('.m-groups--filter-selector-item:nth-child(2)'));
    expect(a).not.toBeNull();

    expect(a.nativeElement.textContent).toContain('Images');
    expect(a.nativeElement.href).toContain('/groups/profile/123/feed/image');
    expect(a.nativeElement.classList).toContain('m-groups--filter-selector-active')
  });

  it('should have a link to videos', () => {
    comp.filter = 'image';
    fixture.detectChanges();

    const a = fixture.debugElement.query(By.css('.m-groups--filter-selector-item:nth-child(3)'));
    expect(a).not.toBeNull();

    expect(a.nativeElement.textContent).toContain('Videos');
  });
});
