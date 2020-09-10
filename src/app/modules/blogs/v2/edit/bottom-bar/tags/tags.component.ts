import { Component, ElementRef, ViewChild } from '@angular/core';
import { BlogsEditService } from '../../blog-edit.service';

@Component({
  selector: 'm-blogEditor__tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.ng.scss'],
})
export class BlogEditorTagsComponent {
  constructor(public service: BlogsEditService) {}
}
