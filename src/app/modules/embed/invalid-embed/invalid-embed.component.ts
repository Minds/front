import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'm-invalid-embed',
  templateUrl: './invalid-embed.component.html',
  styleUrls: ['./invalid-embed.component.scss'],
})
export class InvalidEmbedComponent implements OnInit {
  @Input()
  message: string;

  constructor() {}

  ngOnInit(): void {}
}
