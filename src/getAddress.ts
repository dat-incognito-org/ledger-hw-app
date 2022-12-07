import type Transport from "@ledgerhq/hw-transport";
import { cmd } from "./constants";

export async function getAddress(transport: Transport) {
    let buf =  Buffer.from([]);
    return transport.send(cmd.cla, cmd.GetAddress, 0x00, 0x00, buf);
}
