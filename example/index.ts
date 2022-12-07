import type Transport from "@ledgerhq/hw-transport";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import TransportNodeHID from "@ledgerhq/hw-transport-node-hid";
import TransportHttp from "@ledgerhq/hw-transport-http";
import { getAddress } from "../src";
async function main() {
    const tra: Transport = await TransportHttp(['http://127.0.0.1:9998']).create();
    // const tra: Transport = await TransportWebHID.create();
    // const tra: Transport = await TransportNodeHID.create();
    const res = await getAddress(tra);
    console.log(res);
}
main()