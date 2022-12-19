import type Transport from "@ledgerhq/hw-transport";
import { cmd } from "./constants";


export async function genAlpha(transport: Transport, alphaLen: number) {
    let buf = Buffer.from([]);
    return transport.send(cmd.cla, cmd.GenAlpha, alphaLen, 0x00, buf);
}

export async function setAlpha(transport: Transport, index: number, data: string) {
    const buf = Buffer.from(data, "base64")
    return await transport.send(cmd.cla, cmd.SetAlpha, index, 0x00, buf)
}

export async function getAlpha(transport: Transport, alphaLen: number, data: string[]) {
    const buf = Buffer.from([])
    for (let i = 0; i < alphaLen; i++) {
        const res = await  transport.send(cmd.cla, cmd.GetAlpha, i, 0x00, buf)
        console.log(res)
    }
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
    const pedComG = Buffer.from(params[params.length - 1], "base64")
    try {
        let result = [];
        for (let i = 0; i < params.length - 1; i++) {
            const h = Buffer.from(params[i], "base64")
            const msg = await transport.send(cmd.cla, cmd.CalculateC, 0x00, i, h)
            result.push(msg.subarray(0, 64));
        }
        const msg = await transport.send(cmd.cla, cmd.CalculateC, 0x01, params.length - 1, pedComG)
        result.push(msg.subarray(0, 32));
        return Buffer.concat(result);
    }
    catch (err) {
        console.error(err)
    }
}

export async function calculateR(transport: Transport, coinLen: number, cPi: string) {
    const buf = Buffer.from(cPi, "base64")
    try {
        let result = [];
        for (let i = 0; i < coinLen; i++) {
            const msg = await transport.send(cmd.cla, cmd.CalculateR, 0x00, i, buf)
            result.push(msg.subarray(0, 32));
        }
        return result;
    }
    catch (err) {
        console.error(err)
    }
}

export async function calculateCoinPrivKey(transport: Transport, coinsH: string[]) {

    for (let i = 0; i < coinsH.length - 1; i++) {
        let buf = Buffer.from(coinsH[i], "base64")
        await transport.send(cmd.cla, cmd.GenCoinPrivateKey, 0x00, i, buf)
    }
    let buf = Buffer.from(coinsH[coinsH.length - 1], "base64")
    await transport.send(cmd.cla, cmd.GenCoinPrivateKey, 0x01, coinsH.length - 1, buf)
}

export async function signSchnorr(transport: Transport, pedRand: string, pedPriv: string, randomness: string, message: string) {
    let pRand;
    const pPriv = Buffer.from(pedPriv, "base64")
    const rand = Buffer.from(randomness, "base64")
    const msg = Buffer.from(message, "base64")
    if (pedRand.length == 0) {
        pRand = Buffer.alloc(32);
        pRand = Buffer.from([])
    } else {
        pRand = Buffer.from(pedRand, "base64")
    }
    let buf = Buffer.alloc(pRand.length + pPriv.length + rand.length + msg.length)
    pRand.copy(buf, 0, pRand.length)
    pPriv.copy(buf, pRand.length, pPriv.length)
    rand.copy(buf, pRand.length + pPriv.length, rand.length)
    msg.copy(buf, pRand.length + pPriv.length + rand.length, msg.length)

    try {
        const res = await transport.send(cmd.cla, cmd.SignSchnorr, 0x00, 0x00, buf)
        return res
    }
    catch (err) {
        console.error(err)
    }
}