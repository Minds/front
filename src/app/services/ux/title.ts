import { MetaService } from '../../common/services/meta.service';

export class MindsTitle {
  constructor(private metaService: MetaService) {}

  setTitle(value: string, join: boolean = true): MindsTitle {
    console.warn(
      '[deprecated]: title.setTitle should not be used. use MetaService instead.'
    );
    this.metaService.setTitle(value, join);
    return this;
  }
}
