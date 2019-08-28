/**
 * generates an activity from an image or video
 * @param entity
 */
export default function toMockActivity(entity: any, dimensions?: any) {
  let obj = {
    ...entity,
    entity_guid: entity.guid,
    custom_type: entity.subtype,
  };

  if (entity.subtype === 'video') {
    obj.custom_data = {
      ...entity,
      dimensions: dimensions
    };
  } else if (entity.subtype === 'blog') {
    obj.custom_data = [{
      ...entity,
      dimensions: {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      }
    }];
  } else {
    obj.custom_data = [{
      ...entity,
      width: 0,
      height: 0
    }];
  }

  return obj;
}

class Translate {
  execute(entity: any) {

  }
}

class ImageTranslate extends Translate {
  execute(entity: any) {
    return {};
  }
}

