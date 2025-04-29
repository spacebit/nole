import { Hex, HttpTransport, PublicClient } from "@nilfoundation/niljs"
import config from "../../utils/config"
import { expect } from "chai";

export const expectTokenBelongsTo = async (options: {nft: Hex, owner: Hex}) => {
    const client = new PublicClient({
      transport: new HttpTransport({endpoint: config.rpc})
    });

    const tokens = await client.getTokens(options.owner, 'latest');
    expect(tokens).has.property(options.nft).eq(1n);
}