import { BehaviorSubject } from 'rxjs';
import discoveryTagsMock from '../../../mocks/responses/discovery-tags.mock';

export let DiscoveryTagsServiceMock = new (function() {
  this.addSingleTag = tag => {
    return null;
  };
  this.removeSingleTag = tag => {
    return null;
  };

  this.tags$ = new BehaviorSubject(discoveryTagsMock.tags);
  this.trending$ = new BehaviorSubject(discoveryTagsMock.trending);
  this.foryou$ = new BehaviorSubject(discoveryTagsMock.for_you);
  this.activityRelated$ = new BehaviorSubject(
    discoveryTagsMock.activity_related
  );

  this.inProgress$ = new BehaviorSubject(false);

  this.loadTags = () => Promise.resolve(discoveryTagsMock);
  this.saveTags = () => Promise.resolve(true);
})();
