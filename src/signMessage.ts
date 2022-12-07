import type Transport from "@ledgerhq/hw-transport";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import TransportHttp from "@ledgerhq/hw-transport-http";

const cmd = {
    GetVersion: 0x01,
    GetAddress: 0x02,
    GetViewKey: 0x03,
    GetPrivateKey: 0x04,
    SwitchKey: 0x05,
    GetOTAKey: 0x06,
    GetValidatorKey: 0x07,
    KeyImage: 0x10,
    // gen ring sig s set
    GenAlpha: 0x21,
    CalculateC: 0x22,
    CalculateR: 0x23,
    GenCoinPrivateKey: 0x24,
    SignSchnorr: 0x40,
    TrustHost: 0x60,
    p1First: 0x00,
    p1More: 0x80,
    p2DisplayAddress: 0x00,
    p2DisplayPubkey: 0x01,
    p2DisplayHash: 0x00,
    p2SignHash: 0x01,
    cla: 0xE0
}


export async function signMessage(transport: Transport) {
    let buf =  Buffer.from([]);
    console.log('input buffer', buf)
    const res = await transport.send(cmd.cla, cmd.GetAddress, 0x00, 0x00, buf);
    console.log('result', res);
}

async function main() {
    const tra: Transport = await TransportHttp(['http://127.0.0.1:9998']).create();
    await signMessage(tra);
}
main()
