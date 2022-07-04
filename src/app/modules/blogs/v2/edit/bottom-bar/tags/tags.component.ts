import { Component, ElementRef, ViewChild } from '@angular/core';
import { BlogsEditService } from '../../blog-edit.service';

/**
 * Add tags to the blog that's being edited.
 * Has a list of trending tags and also a input box to manually add tags
 */
@Component({
  selector: 'm-blogEditor__tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.ng.scss'],
})
export class BlogEditorTagsComponent {
  constructor(public service: BlogsEditService) {}
}
