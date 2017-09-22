export class Experimental {

  feature(feature: string): boolean {
    return window.Minds.user &&
      window.Minds.user.feature_flags &&
      window.Minds.user.feature_flags.length &&
      window.Minds.user.feature_flags.indexOf(feature) > -1;
  }

}
