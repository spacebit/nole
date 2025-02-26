
import { Hex, HttpTransport, PublicClient } from "@nilfoundation/niljs";
import {it} from "vitest";
import testConfig from "./utils/testConfig";

it("Should connect and query account's balance", async () => {
  const client = new PublicClient({
    transport: new HttpTransport({endpoint: testConfig.rpc})
  });

  await client.getBalance(testConfig.wallet as Hex);
});
