import type Transport from "@ledgerhq/hw-transport";
import { cmd } from "./constants";

export  async  function getVersion(transport: Transport) {
    let buf = Buffer.from([]);
    return transport.send(cmd.cla, cmd.GetVersion, 0x00, 0x00, buf);
}
