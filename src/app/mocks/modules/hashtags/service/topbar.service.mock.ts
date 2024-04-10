import { EventEmitter } from '@angular/core';

export let topbarHashtagsServiceMock = new (function () {
  this.selectionChange = new EventEmitter();
  this.toggleSelection = jasmine.createSpy('toggleSelection').and.stub();

  this.loadResponse = [
    {
      value: 'hashtag1',
      selected: true,
    },
    {
      value: 'hashtag2',
      selected: false,
    },
  ];

  this.load = jasmine.createSpy('load').and.callFake(async () => {
    return this.loadResponse;
  });

  this.cleanupHashtag = (hashtag: string) => {
    const regex = /\w*/gm;
    let m;
    let result = '';

    while ((m = regex.exec(hashtag)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      // The result can be accessed through the `m`-variable.
      m.forEach((match, groupIndex) => {
        result += match;
      });
    }
    return result;
  };
})();
