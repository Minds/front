import { Component, Input, Output, EventEmitter, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'm-video--quality-selector',
  templateUrl: 'quality-selector.component.html'
})

export class MindsVideoQualitySelector {
  @Input('src') src: Array<any>;
  @Output('selectedQuality') selectedQuality: EventEmitter<any> = new EventEmitter();

  selected: any = {};
  qualityOptions: Array<any> = [];

  constructor() {}

  ngOnInit() {
    this.getQualityOptions();
  }

  selectQuality(quality){
    this.selected.id = quality.id;
    this.selected.reorderedSrc = this.src.filter(source => source.uri === quality.uri);
    this.src.map(source => {
      if(source.uri !== quality.uri){
        this.selected.reorderedSrc.push(source);
      }
    });
    this.selectedQuality.emit( this.selected );
  }

  getQualityOptions() {
    if(this.src.length > 1){
      this.qualityOptions = this.src.map( (source) => {
        let splitted = source.uri.split("/");
        let quality_string = splitted[splitted.length-1];
        return {
          id : quality_string.substr(0,quality_string.indexOf('.')),
          uri : source.uri
        };
      });
      
      this.qualityOptions = this.qualityOptions.sort(function(a, b) {
        return parseFloat(b.id) - parseFloat(a.id);
      });

      this.selected.id = this.qualityOptions[0].id;
    }
  }
}
