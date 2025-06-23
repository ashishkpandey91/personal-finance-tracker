import CONF from "@/conf";
import { Client } from "appwrite";

export class AppClient {
  client: Client;

  constructor() {
    this.client = new Client()
      .setEndpoint(CONF.get("APPWRITE_URL"))
      .setProject(CONF.get("APPWRITE_PROJECT_ID"));
  }
}

export default AppClient;
