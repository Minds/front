import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { Session } from '../../../../services/session';
import { PostMenuService } from '../post-menu.service';
import { PostMenuV2Component } from './menu.component';
import { MockComponent, MockService } from '../../../../utils/mock';

describe('PostMenuV2Component', () => {
  let comp: PostMenuV2Component;
  let fixture: ComponentFixture<PostMenuV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PostMenuV2Component,
        MockComponent({
          selector: 'm-dropdownMenu',
          inputs: ['anchorPosition', 'menu'],
        }),
        MockComponent({
          selector: 'm-dropdownMenu__item',
          outputs: ['click'],
        }),
      ],
      providers: [
        { provide: Session, useValue: MockService(Session) },
        {
          provide: ChangeDetectorRef,
          useValue: MockService(ChangeDetectorRef),
        },
      ],
    })
      .overrideProvider(PostMenuService, {
        useValue: MockService(PostMenuService),
      })
      .compileComponents();

    fixture = TestBed.createComponent(PostMenuV2Component);
    comp = fixture.componentInstance;

    spyOn(comp.optionSelected, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should emit onOptionSelected when option is edit for onSelectedOption', async () => {
    const option = 'edit';
    await comp.onSelectedOption(option);
    expect(comp.optionSelected.emit).toHaveBeenCalledWith(option);
  });

  it('should emit and openShareModal in when option is share for onSelectedOption', async () => {
    const option = 'share';
    await comp.onSelectedOption(option);
    expect(comp.service.openShareModal).toHaveBeenCalled();
    expect(comp.optionSelected.emit).toHaveBeenCalledWith(option);
  });

  it('should call togglePinned and emit when option is pin for onSelectedOption', async () => {
    const option = 'pin';
    await comp.onSelectedOption(option);
    expect(comp.service.togglePinned).toHaveBeenCalled();
    expect(comp.optionSelected.emit).toHaveBeenCalledWith(option);
  });

  it('should emit from optionSelected when option is translate for onSelectedOption', async () => {
    const option = 'translate';
    await comp.onSelectedOption(option);
    expect(comp.optionSelected.emit).toHaveBeenCalledWith(option);
  });

  it('should call subscribe and emit when option is subscribe for onSelectedOption', async () => {
    const option = 'subscribe';
    await comp.onSelectedOption(option);
    expect(comp.service.subscribe).toHaveBeenCalled();
    expect(comp.optionSelected.emit).toHaveBeenCalledWith(option);
  });

  it('should call unSubscribe and emit when option is unsubscribe for onSelectedOption', async () => {
    const option = 'unsubscribe';
    await comp.onSelectedOption(option);
    expect(comp.service.unSubscribe).toHaveBeenCalled();
    expect(comp.optionSelected.emit).toHaveBeenCalledWith(option);
  });

  it('should call follow and emit when option is follow for onSelectedOption', async () => {
    const option = 'follow';
    await comp.onSelectedOption(option);
    expect(comp.service.follow).toHaveBeenCalled();
    expect(comp.optionSelected.emit).toHaveBeenCalledWith(option);
  });

  it('should call unfollow and emit when option is unfollow for onSelectedOption', async () => {
    const option = 'unfollow';
    await comp.onSelectedOption(option);
    expect(comp.service.unfollow).toHaveBeenCalled();
    expect(comp.optionSelected.emit).toHaveBeenCalledWith(option);
  });

  it('should call block and emit when option is block for onSelectedOption', async () => {
    const option = 'block';
    await comp.onSelectedOption(option);
    expect(comp.service.block).toHaveBeenCalled();
    expect(comp.optionSelected.emit).toHaveBeenCalledWith(option);
  });

  it('should call unBlock and emit when option is unblock for onSelectedOption', async () => {
    const option = 'unblock';
    await comp.onSelectedOption(option);
    expect(comp.service.unBlock).toHaveBeenCalled();
    expect(comp.optionSelected.emit).toHaveBeenCalledWith(option);
  });

  it('should call allowComments with true and emit when option is allow-comments for onSelectedOption', async () => {
    const option = 'allow-comments';
    await comp.onSelectedOption('allow-comments');
    expect(comp.service.allowComments).toHaveBeenCalledWith(true);
    expect(comp.optionSelected.emit).toHaveBeenCalledWith(option);
  });

  it('should call allowComments with false and emit when option is disable-comments for onSelectedOption', async () => {
    const option = 'disable-comments';
    await comp.onSelectedOption('disable-comments');
    expect(comp.service.allowComments).toHaveBeenCalledWith(false);
    expect(comp.optionSelected.emit).toHaveBeenCalledWith(option);
  });

  it('should call openBoostModal and emit when option is boost for onSelectedOption', async () => {
    const option = 'boost';
    await comp.onSelectedOption(option);
    expect(comp.service.openBoostModal).toHaveBeenCalled();
    expect(comp.optionSelected.emit).toHaveBeenCalledWith(option);
  });

  it('should call confirmDelete and emit optionSelected when option is delete for onSelectedOption', async () => {
    const option = 'delete';
    await comp.onSelectedOption(option);
    expect(comp.optionSelected.emit).not.toHaveBeenCalledWith(option);
  });

  it('should call openReportModal and emit when option is report for onSelectedOption', async () => {
    const option = 'report';
    await comp.onSelectedOption(option);
    expect(comp.service.openReportModal).toHaveBeenCalled();
    expect(comp.optionSelected.emit).toHaveBeenCalledWith(option);
  });
});
