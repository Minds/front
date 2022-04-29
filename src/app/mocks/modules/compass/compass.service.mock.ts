import { BehaviorSubject } from 'rxjs';

export let compassServiceMock = new (function() {
  this.questions$ = new BehaviorSubject([]);
  this.answers$ = new BehaviorSubject([]);
  this.answersProvided$ = new BehaviorSubject(false);
  this.submitRequested$ = new BehaviorSubject(false);

  this.fetchQuestions = jasmine
    .createSpy('fetchQuestions')
    .and.callFake(function() {
      return {};
    });

  this.saveAnswers = jasmine.createSpy('saveAnswers').and.callFake(function() {
    return {};
  });
  this.hasCompletedCompassAnswers = jasmine
    .createSpy('hasCompletedCompassAnswers')
    .and.returnValue(true);
})();
