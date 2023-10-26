import {
  MindsGroup,
  MindsUser,
} from '../../../../../../../interfaces/entities';

/** Input params for modal */
export type AddFeaturedEntityInputParams = {
  onDismissIntent: () => void;
  onSaveIntent: (entity: MindsUser | MindsGroup) => void;
  entityType?: AddFeaturedEntityModalEntityType;
};

/** Entity types modal can be used to get. */
export enum AddFeaturedEntityModalEntityType {
  User,
  Group,
}
