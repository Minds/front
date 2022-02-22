import { FeedAlgorithm } from './../subscribed.component';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'm-feedHeader',
  templateUrl: './feed-header.component.html',
  styleUrls: ['./feed-header.component.ng.scss'],
})
export class FeedHeaderComponent {
  @Input()
  algorithm: FeedAlgorithm = 'latest';
}
