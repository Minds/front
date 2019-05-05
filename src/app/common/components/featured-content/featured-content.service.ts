import { Injectable } from "@angular/core";
import { BoostedContentService } from "../../services/boosted-content.service";

@Injectable()
export class FeaturedContentService {
  constructor(
    protected boostedContentService: BoostedContentService,
  ) {
  }

  async fetch() {
    return await this.boostedContentService.fetch();
  }
}
