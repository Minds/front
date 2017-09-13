import { Injectable } from "@angular/core";

import { Client } from "../../services/api";
import { Session, SessionFactory } from "../../services/session";

@Injectable()
export class OnboardingService {

  constructor(private client: Client, private session: Session) { }

}
