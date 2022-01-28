// Keys for overridable Growthbook attributes.
export type OverridableAttributeKey = 'loggedIn' | 'route' | 'id';

// Object of overridable Growthbook attributes, allowing you to override when calling to sync.
export type OverridableAttributes =
  | {
      [key in OverridableAttributeKey]: string;
    }
  | {};
