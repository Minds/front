/**
 * Dropdown menu for blogs in edit mode v2
 */
import { Component } from '@angular/core';
import { BlogsEditService } from '../blog-edit.service';
import { NSFW_REASONS } from '../../../../../common/components/nsfw-selector/nsfw-selector.service';
import { NsfwEnabledService } from '../../../../multi-tenant-network/services/nsfw-enabled.service';

/**
 * Dropdown menu for editing blogs.
 * Includes nested menus for permaweb, license, nsfw, visibility
 */
@Component({
  selector: 'm-blogEditor__dropdown',
  host: {
    class: 'm-blogEditor__dropdown',
  },
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.ng.scss'],
})
export class BlogEditorDropdownComponent {
  /**
   * nsfw reasons
   */
  public reasons: typeof NSFW_REASONS = NSFW_REASONS;

  constructor(
    private editService: BlogsEditService,
    protected nsfwEnabledService: NsfwEnabledService
  ) {}

  /**
   * Gets nsfw value from service.
   */
  getNSFW() {
    return this.editService.nsfw$;
  }

  /**
   * Calls service to toggle NSFW.
   * @param { number } - number to toggle
   */
  toggleNSFW(value: number): void {
    this.editService.toggleNSFW(value);
  }
}
