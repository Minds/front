import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsProfileFilterSelector } from './filter-selector.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('GroupsProfileFilterSelector', () => {

  let comp: GroupsProfileFilterSelector;
  let fixture: ComponentFixture<GroupsProfileFilterSelector>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [GroupsProfileFilterSelector],
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

    expect(div.nativeElement.children.length).toBe(2);
  });

  it('should have a link to the groups feed', () => {
    const a = fixture.debugElement.query(By.css('.m-groups--filter-selector-item:first-child'));
    expect(a).not.toBeNull();

    expect(a.nativeElement.textContent).toContain('Feed');
    expect(a.nativeElement.href).toContain('/groups/profile/123/activity');
    expect(a.nativeElement.classList).toContain('m-groups--filter-selector-active')
  });

  it('should have a link to the groups conversation', () => {
    comp.filter = 'conversation';
    fixture.detectChanges();

    const a = fixture.debugElement.query(By.css('.m-groups--filter-selector-item:last-child'));
    expect(a).not.toBeNull();

    expect(a.nativeElement.textContent).toContain('Conversations');
    expect(a.nativeElement.href).toContain('/groups/profile/123/conversation');
    expect(a.nativeElement.classList).toContain('m-groups--filter-selector-active')
  });
});
