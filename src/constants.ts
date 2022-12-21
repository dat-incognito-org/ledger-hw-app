
export const cmd = {
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
    SetAlpha: 0x25,
    GetAlpha: 0x26,
    CalculateC: 0x22,
    CalculateR: 0x23,
    GenCoinPrivateKey: 0x24,
    DecryptCoin: 0x27,
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
