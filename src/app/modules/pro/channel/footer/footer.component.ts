import { Component } from '@angular/core';

@Component({
  selector: 'm-pro--channel-footer',
  templateUrl: 'footer.component.html'
})

export class ProChannelFooterComponent {

  links:any;
  rowCount: number;

  constructor(){
    this.links = [
      {
        text: 'What we are',
        src: ''
      },
      {
        text: 'Core Values',
        src: ''
      },
      {
        text: 'Subscribe',
        src: ''
      },
      {
        text: 'Support',
        src: ''
      },
      {
        text: 'Careers',
        src: ''
      },
      {
        text: 'Events',
        src: ''
      },
      {
        text: 'Contact',
        src: ''
      },
      {
        text: 'Contribute',
        src: ''
      },
      {
        text: 'Investors',
        src: ''
      }
    ];

    this.setLinksToRows();
  }

  /**
   * Distribute links in cols and rows
   */
  setLinksToRows() {
    this.getRowsCount();
    const links = this.links;
    this.links = [];
    let i,j, chunk = this.rowCount;
    for (i=0,j=links.length; i<j; i+=chunk) {
      this.links.push(links.slice(i,i+chunk));
    }
  }

  getRowsCount() {
    const linksCount = this.links.length;
    let rowMultiplier = 6
    let rowCount = 1;

    while (((rowMultiplier * rowCount) % linksCount) > 0) {
      rowCount++;
    }

    this.rowCount = rowCount;
  }
}
