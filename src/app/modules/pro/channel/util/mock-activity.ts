/**
 * generates an activity from an image or video
 * @param entity
 */
export default function toMockActivity(entity: any) {
  let obj = {
    ...entity,
    entity_guid: entity.guid,
    custom_type: entity.subtype,
  };

  if (entity.subtype === 'video') {
    obj.custom_data = {
      ...entity,
      dimensions: this.videoDimensions
    };
  } else {
    obj.custom_data = [{
      ...entity,
      width: 0,
      height: 0
    }];
  }

  return obj;
}
