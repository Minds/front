import { Injectable } from "@angular/core";
import { Client } from "./api";

@Injectable()
export class EntitiesService {
  constructor(protected client: Client) {
  }

  async single(guid: string) {
    try {
      const response: any = await this.client.get(`api/v1/entities/entity/${guid}`);

      if (!response || !response.entity) {
        return false;
      }

      return response.entity;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static _(client: Client) {
    return new EntitiesService(client);
  }
}
