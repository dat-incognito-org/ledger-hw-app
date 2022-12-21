import type Transport from "@ledgerhq/hw-transport";
import { cmd } from "./constants";

export async function decryptCoin(transport: Transport, txConcealRndStr: string, coinAmtStr: string, coinRndStr: string) {
    const txConcealRnd = Buffer.from(txConcealRndStr, "base64");
    const coinAmt = Buffer.from(coinAmtStr, "base64");
    const coinRnd = Buffer.from(coinRndStr, "base64");
    if (txConcealRnd.length != 32) throw 'invalid txConcealRnd';
    if (coinAmt.length != 32) throw 'invalid coinAmt';
    if (coinRnd.length != 32) throw 'invalid coinRnd';

    let buffer = Buffer.alloc(96);
    txConcealRnd.copy(buffer, 0);
    coinAmt.copy(buffer, 32);
    coinRnd.copy(buffer, 64);

    const res = await transport.send(cmd.cla, cmd.DecryptCoin, 0x00, 0x00, buffer);
    return {
        Amount: res.subarray(0, 32).toString('base64'),
        Randomness: res.subarray(32, 64).toString('base64'),
    }
}