import type Transport from "@ledgerhq/hw-transport";
import { cmd } from "./constants";
import { transcode } from "buffer";


export async function genAlpha(transport: Transport, alphaLen: number) {
    let buf = Buffer.from([]);
    return transport.send(cmd.cla, cmd.GenAlpha, alphaLen, 0x00, buf);
}

export async function calculateKeyImage(transport: Transport, encryptKmB64: string, coinPubKeyB64: string) {
    const coinPubKey = Buffer.from(coinPubKeyB64, "base64")
    const coinEncryptKm = Buffer.from(encryptKmB64, "base64")
    if (coinPubKey.length != 32) throw 'invalid coinPubKey';
    if (coinEncryptKm.length != 32) throw 'invalid coinEncryptKm';
    let buffer = Buffer.alloc(64);
    
    coinEncryptKm.copy(buffer, 0);
    coinPubKey.copy(buffer, 32);
    return transport.send(cmd.cla, cmd.KeyImage, 0x00, 0x00, buffer);
}


export async function calculateFirstC(transport: Transport, params: string[]) {
    const pedComG = Buffer.from(params[params.length - 1])
    try {
        for (let i = 0; i < params.length - 2; i++) {
            const h = Buffer.from(params[i])
            let buf = Buffer.alloc(params[i].length + pedComG.length)
            h.copy(buf, 0, h.length)
            pedComG.copy(buf, h.length, pedComG.length)
            const msg = await transport.send(cmd.cla, cmd.CalculateC, 0x00, i, buf)
            console.log(msg)
        }
        let buf = Buffer.from(params[params.length - 1])
        const msg = await transport.send(cmd.cla, cmd.CalculateC, 0x01, params.length - 1, buf)
        console.log(msg)
    }
    catch (err) {
        console.log(err)
    }
}

export async function calculateR(transport: Transport, coinLen: number, cPi: string) {
    const buf = Buffer.from(cPi)
    try {
        for (let i = 0; i < coinLen; i++) {
            const msg = await transport.send(cmd.cla, cmd.CalculateR, 0x00, i, buf)
            console.log(msg)
        }
    }
    catch (err) {
        console.log(err)
    }
}

export async function calculateCoinPrivKey(transport: Transport, coinsH: string[]) {

    for (let i = 0; i < coinsH.length - 1; i++) {
        let buf = Buffer.from(coinsH[i])
        const msg = await transport.send(cmd.cla, cmd.GenCoinPrivateKey, 0x00, i, buf)
        console.log(msg)
    }
    let buf = Buffer.from(coinsH[coinsH.length - 1])
    const msg = await transport.send(cmd.cla, cmd.GenCoinPrivateKey, 0x01, coinsH.length - 1, buf)
    console.log(msg)
}