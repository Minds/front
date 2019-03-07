import { Client } from "../../../../services/api";
import { Injectable } from "@angular/core";

@Injectable()
export class JurySessionService {

  constructor(
    private client: Client,
  ) {

  }

  async getList(opts) {
    return await this.client.get('api/v2/moderation/jury/' + opts.juryType);
  }

}