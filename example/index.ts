import type Transport from "@ledgerhq/hw-transport";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import TransportHttp from "@ledgerhq/hw-transport-http";
import {getAddress, getOTAKey, getVersion, getViewKey, genAlpha, calculateR, calculateFirstC, calculateCoinPrivKey} from "../src";
async function main() {
    const tra: Transport = await TransportHttp(['http://127.0.0.1:9998']).create();
    // const tra: Transport = await TransportWebHID.create();
    // const tra: Transport = await TransportNodeHID.create();
    // const res = await getAddress(tra);
    // const res = await getOTAKey(tra);
    // const res = await calculateFirstC(tra, ["hahaha","hehehe","hihihi"]);
    // const res = await calculateR(tra, 10, "Lam bi khung :V");
    const res = await calculateCoinPrivKey(tra, ["hahaha","hehehe","hihihi"]);
    console.log(res);
}
main()