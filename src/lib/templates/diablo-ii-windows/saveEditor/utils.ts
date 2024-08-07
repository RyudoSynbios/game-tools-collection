import { get } from "svelte/store";

import { dataView } from "$lib/stores";
import { getInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import debug from "$lib/utils/debug";

import type { ItemChecksum } from "$lib/types";

// let EAX = 0x0019cf40;
// let EBX = 0x00e7007c;
// let ECX = 0x00000000;
// let EDX = 0x0019cf40;
// let ESI = 0x0019d313;
// let EDI = 0x00e4a400;
// let EBP = 0x0019cf5c;
// let ESP = 0x0019cf24;

let EAX = 0x0019cf40;
let EBX = 0x00000000;
let ECX = 0x00000001;
let EDX = 0x0000000a;
let ESI = 0x05755010;
let EDI = 0x00000000;
let EBP = 0x0019cf5c;
let ESP = 0x0019cf24;

let ESI_04 = 0x1640;
let ESI_08 = 0x0;
let ESI_0C = 0x0;
let EBP_04 = 0x0;
let EBP_08 = 0x0019cf40;
let EBP_0C = 0x9;

const EBX_ARRAY: number[] = [];
const ECX_ARRAY: number[] = [];
const ESI_ARRAY: number[] = [];
const EDI_ARRAY: number[] = [];
const EBP_ARRAY: number[] = [];

let offset = 0x2ff;

const masks1 = [0x0, 0x1, 0x3, 0x7, 0xf, 0x1f, 0x3f, 0x7f, 0xff];
const masks2 = [0xff, 0xfe, 0xfc, 0xf8, 0xf0, 0xe0, 0xc0, 0x80];

export function initShifts(shifts: number[]): number[] {
  // for (let i = 0x0; i < 0x4; i += 0x1) {
  loadStats();
  // }

  return shifts;
}

export function loadStats(): void {
  // // 00410f60 55              PUSH       EBP
  // EBP_ARRAY.push(EBP);
  // // 00410f61 8b ec           MOV        EBP,ESP
  // EBP = ESP;
  // // 00410f63 51              PUSH       ECX
  // ECX_ARRAY.push(ECX);
  // // 00410f64 8b 4d 0c        MOV        ECX,dword ptr [EBP + 0xc]
  // ECX = EBP_0C;
  // // 00410f67 56              PUSH       ESI
  // ESI_ARRAY.push(ESI);
  // // 00410f68 8b 75 08        MOV        ESI,dword ptr [EBP + 0x8]
  // ESI = EBP_08;
  // // 00410f6b 8b 46 08        MOV        EAX,dword ptr [ESI + 0x8]
  // EAX = ESI_08;
  // // 00410f6e 03 c0           ADD        EAX,EAX
  // EAX += EAX;
  // // 00410f70 03 c0           ADD        EAX,EAX
  // EAX += EAX;
  // // 00410f72 03 c0           ADD        EAX,EAX
  // EAX += EAX;
  // // 00410f74 2b 46 04        SUB        EAX,dword ptr [ESI + 0x4]
  // EAX -= ESI_04;
  // // 00410f77 ba 00 00        MOV        EDX,0x0
  // EDX = 0x0;
  // // 00410f7c 03 c1           ADD        EAX,ECX
  // EAX += ECX;
  // // 00410f7e 03 46 0c        ADD        EAX,dword ptr [ESI + 0xc]
  // EAX += ESI_0C;
  // // 00410f81 79 02           JNS        LAB_00410f85
  // // prettier-ignore
  // console.log(
  //   "\nEAX:", EAX.toHex(),
  //   "\nEBX:", EBX.toHex(),
  //   "\nECX:", ECX.toHex(),
  //   "\nEDX:", EDX.toHex(),
  //   "\nESI:", ESI.toHex(),
  //   "\nEDI:", EDI.toHex(),
  //   "\nEBP:", EBP.toHex(),
  // );
  // if (EAX >= 0x0) {
  //   return LAB_00410f85();
  // }
  // // 00410f83 33 c0           XOR        EAX,EAX
  // EAX ^= EAX;

  // return LAB_00410f85();

  // function LAB_00410f85() {
  //   // 00410f85 2b c8           SUB        ECX,EAX
  //   ECX -= EAX;
  //   // 00410f87 3b c2           CMP        EAX,EDX
  //   const i = EAX === EDX;
  //   // 00410f89 74 07           JZ         LAB_00410f92
  //   if (i) {
  //     return LAB_00410f92();
  //   }
  //   // ! 00410f8b c7 46 10        MOV        dword ptr [ESI + 0x10],0x1
  //   // ESI_10 = 0x1

  //   return LAB_00410f92();
  // }

  // function LAB_00410f92() {
  //   // 00410f92 3b ca           CMP        ECX,EDX
  //   const i = ECX <= EDX;
  //   // 00410f94 8b c1           MOV        EAX,ECX
  //   EAX = ECX;
  //   // 00410f96 89 55 0c        MOV        dword ptr [EBP + 0xc],EDX
  //   EBP_0C = EDX;
  //   // 00410f99 89 55 08        MOV        dword ptr [EBP + 0x8],EDX
  //   EBP_08 = EDX;
  //   // 00410f9c 89 45 fc        MOV        dword ptr [EBP - 0x4],EAX
  //   EBP_04 = EAX;
  //   // 00410f9f 7e 6a           JLE        LAB_0041100b
  //   if (i) {
  //     return LAB_0041100b();
  //   }
  //   // 00410fa1 53              PUSH       EBX
  //   EBX_ARRAY.push(EBX);
  //   // 00410fa2 57              PUSH       EDI
  //   EDI_ARRAY.push(EDI);

  //   return LAB_00410fa3();
  // }

  // function LAB_00410fa3() {
  //   // 00410fa3 ba 08 00        MOV        EDX,0x8
  //   EDX = 0x8;
  //   // 00410fa8 2b 56 0c        SUB        EDX,dword ptr [ESI + 0xc]
  //   EDX -= ESI_0C;
  //   // 00410fab 3b d0           CMP        EDX,EAX
  //   const i = EDX <= EAX;
  //   // 00410fad 7e 02           JLE        LAB_00410fb1
  //   if (i) {
  //     return LAB_00410fb1();
  //   }
  //   // 00410faf 8b d0           MOV        EDX,EAX
  //   EDX = EAX;

  //   return LAB_00410fb1();
  // }

  // function LAB_00410fb1() {
  //   // 00410fb1 8b 5e 0c        MOV        EBX,dword ptr [ESI + 0xc]
  //   EBX = ESI_0C;
  //   // 00410fb4 8b 3e           MOV        EDI,dword ptr [ESI]
  //   EDI = offset;
  //   // 00410fb6 0f b6 0f        MOVZX      ECX,byte ptr [EDI]
  //   ECX = getInt(EDI, "uint8");
  //   console.log("SAVE:", ECX.toHex());
  //   // 00410fb9 0f b6 83        MOVZX      EAX,byte ptr [EBX + DAT_006ce38c]                = FFh
  //   EAX = masks2[EBX];
  //   console.log("MASK2:", masks2[EBX].toHex());
  //   // 00410fc0 23 c1           AND        EAX,ECX
  //   EAX &= ECX;
  //   // 00410fc2 8a cb           MOV        CL,BL
  //   ECX = EBX;
  //   // 00410fc4 d3 e8           SHR        EAX,CL
  //   EAX >>= ECX;
  //   console.log(">>:", EAX.toHex());
  //   // 00410fc6 8b 4d 08        MOV        ECX,dword ptr [EBP + 0x8]
  //   ECX = EBP_08;
  //   // 00410fc9 01 55 08        ADD        dword ptr [EBP + 0x8],EDX
  //   EBP_08 += EDX;
  //   // 00410fcc 23 04 95        AND        EAX,dword ptr [EDX*0x4 + DAT_006ce368]
  //   EAX &= masks1[EDX];
  //   console.log("MASK1:", masks1[EDX].toHex());
  //   // 00410fd3 d3 e0           SHL        EAX,CL
  //   EAX <<= ECX;
  //   console.log("<<:", EAX.toHex());
  //   // 00410fd5 8d 0c 13        LEA        ECX,[EBX + EDX*0x1]
  //   ECX = EBX + EDX;
  //   // 00410fd8 89 4e 0c        MOV        dword ptr [ESI + 0xc],ECX
  //   ESI_0C = ECX;
  //   // 00410fdb 01 45 0c        ADD        dword ptr [EBP + 0xc],EAX
  //   EBP_0C = EAX;
  //   debug.color(EAX.toHex(2), "green");
  //   // 00410fde 8b 45 fc        MOV        EAX,dword ptr [EBP - 0x4]
  //   EAX = EBP_04;
  //   // 00410fe1 2b c2           SUB        EAX,EDX
  //   EAX -= EDX;
  //   // 00410fe3 83 f9 08        CMP        ECX,0x8
  //   const i = ECX !== 0x8;
  //   // 00410fe6 89 45 fc        MOV        dword ptr [EBP - 0x4],EAX
  //   EBP_04 = EAX;
  //   // 00410fe9 75 10           JNZ        LAB_00410ffb
  //   if (i) {
  //     return LAB_00410ffb();
  //   }
  //   // 00410feb 83 c7 01        ADD        EDI,0x1
  //   offset += 0x1;
  //   // 00410fee 83 46 08 01     ADD        dword ptr [ESI + 0x8],0x1
  //   ESI_08 += 0x1;
  //   // ! 00410ff2 89 3e           MOV        dword ptr [ESI],EDI
  //   // 00410ff4 c7 46 0c        MOV        dword ptr [ESI + 0xc],0x0
  //   ESI_0C = 0x0;

  //   return LAB_00410ffb();
  // }

  // function LAB_00410ffb() {
  //   // ? 00410ffb 85 c0           TEST       EAX,EAX
  //   const i = EAX > 0x0;
  //   // 00410ffd 7f a4           JG         LAB_00410fa3
  //   if (i) {
  //     return LAB_00410fa3();
  //   }
  //   // 00410fff 8b 45 0c        MOV        EAX,dword ptr [EBP + 0xc]
  //   EAX = EBP_0C;
  //   // 00411002 5f              POP        EDI
  //   EDI = EDI_ARRAY.pop();
  //   // 00411003 5b              POP        EBX
  //   EBX = EBX_ARRAY.pop();
  //   // 00411004 5e              POP        ESI
  //   ESI = ESI_ARRAY.pop();
  //   // 00411005 8b e5           MOV        ESP,EBP
  //   ESP = EBP;
  //   // 00411007 5d              POP        EBP
  //   EBP = EBP_ARRAY.pop();
  //   // 00411008 c2 08 00        RET        0x8

  //   console.log("END 1");
  // }

  // function LAB_0041100b() {
  //   // ! 0041100b 8b c2           MOV        EAX,EDX
  //   EAX = EDX;
  //   // ! 0041100d 5e              POP        ESI
  //   ESI = ESI_ARRAY.pop();
  //   // ! 0041100e 8b e5           MOV        ESP,EBP
  //   ESP = EBP;
  //   // ! 00411010 5d              POP        EBP
  //   EBP = EBP_ARRAY.pop();
  //   // ! 00411011 c2 08 00        RET        0x8

  //   console.log("END 2");
  // }

  // !

  let eax = 0x0;
  let ebx = 0x0;
  let ecx = 0x0;
  let edx = 0x0;
  let esi = 0x0;
  let edi = 0x0;
  let ebp = 0x0;
  let esp = 0x0;

  let offset = 0x2ff;
  let arrayIndex = 0x8;
  let unknown1 = 0x0;
  let unknown2 = 0x9;

  const masks1 = [0x0, 0x1, 0x3, 0x7, 0xf, 0x1f, 0x3f, 0x7f, 0xff];
  const masks2 = [0xff, 0xfe, 0xfc, 0xf8, 0xf0, 0xe0, 0xc0, 0x80];

  for (let i = 0x0; i < 0x2; i += 0x1) {
    eax = i % 2 === 0 ? 0x9 : 0xa;
    // ! if ??? > unknown2 = eax
    unknown2 = eax;

    for (let j = 0x0; j < 0x2; j += 0x1) {
      // Game.exe+10FA3 , mov edx,00000008                                   EDX = 8
      edx = 8;
      console.log((0x10fa3).toHex(), "EDX =", edx.toHex());
      // Game.exe+10FA8 , sub edx,[esi+0C]                                   EDX = 8
      edx -= unknown1;
      console.log((0x10fa8).toHex(), "EDX =", edx.toHex());
      debug.color(`${eax} <= ${edx}`, eax <= edx ? "blue" : "red");
      if (eax <= edx) {
        // Game.exe+10FAF , mov edx,eax                                        EAX=00000001 , EBX=00000000 , ECX=00000008 , EDX=00000008 , ESI=0019CF40 , EDI=0019D314
        edx = eax;
        console.log((0x10faf).toHex(), "EDX =", edx.toHex());
      }
      // Game.exe+10FB1 , mov ebx,[esi+0C]                                   EBX = 0
      ebx = unknown1;
      console.log((0x10fb1).toHex(), "EBX =", ebx.toHex());
      // Game.exe+10FB4 , mov edi,[esi]                                      EDI = 0019D313
      edi = offset;
      console.log((0x10fb4).toHex(), "EDI =", edi.toHex());
      // Game.exe+10FB6 , movzx ecx,byte ptr [edi]                           ECX = 00
      ecx = getInt(offset, "uint8");
      console.log((0x10fb6).toHex(), "ECX =", ecx.toHex());
      // Game.exe+10FB9 , movzx eax,byte ptr [ebx+Game.exe+2CE38C]           EAX = FF
      eax = masks2[ebx];
      console.log((0x10fb9).toHex(), "EAX =", eax.toHex());
      // Game.exe+10FC0 , and eax,ecx                                        EAX = 00
      eax &= ecx;
      console.log((0x10fc0).toHex(), "EAX =", eax.toHex());
      // Game.exe+10FC2 , mov cl,bl                                          ECX = 0
      ecx = ebx;
      console.log((0x10fc2).toHex(), "ECX =", ecx.toHex());
      // Game.exe+10FC4 , shr eax,cl                                         EAX = 00
      eax >>= ecx;
      console.log((0x10fc4).toHex(), "EAX =", eax.toHex());
      // Game.exe+10FC6 , mov ecx,[ebp+08]                                   ECX = 0
      // Game.exe+10FC9 , add [ebp+08],edx                                   EAX=00000000 , EBX=00000000 , ECX=00000000 , EDX=00000008 , ESI=0019CF40 , EDI=0019D313
      // Game.exe+10FCC , and eax,[edx*4+Game.exe+2CE368]                    EAX = 00
      eax &= masks1[edx];
      console.log((0x10fcc).toHex(), "EAX =", eax.toHex());
      // Game.exe+10FD3 , shl eax,cl                                         EAX = 00
      eax <= ecx;
      console.log((0x10fd3).toHex(), "EAX =", eax.toHex());
      debug.color(`Value: ${eax.toHex()}`, "green");
      // Game.exe+10FD5 , lea ecx,[ebx+edx]                                  ECX = 8
      ecx = ebx + edx;
      console.log((0x10fd5).toHex(), "ECX =", ecx.toHex());
      // Game.exe+10FD8 , mov [esi+0C],ecx                                   EAX=00000000 , EBX=00000000 , ECX=00000008 , EDX=00000008 , ESI=0019CF40 , EDI=0019D313
      unknown1 = ecx;
      // Game.exe+10FDB , add [ebp+0C],eax                                   EAX=00000000 , EBX=00000000 , ECX=00000008 , EDX=00000008 , ESI=0019CF40 , EDI=0019D313
      // Game.exe+10FDE , mov eax,[ebp-04]                                   EAX = 9
      eax = unknown2;
      console.log((0x10fde).toHex(), "EAX =", eax.toHex());
      // Game.exe+10FE1 , sub eax,edx                                        EAX = 1
      eax -= edx;
      console.log((0x10fe1).toHex(), "EAX =", eax.toHex());
      // Game.exe+10FE3 , cmp ecx,08                                         EAX=00000001 , EBX=00000000 , ECX=00000008 , EDX=00000008 , ESI=0019CF40 , EDI=0019D313
      // Game.exe+10FE6 , mov [ebp-04],eax                                   EAX=00000001 , EBX=00000000 , ECX=00000008 , EDX=00000008 , ESI=0019CF40 , EDI=0019D313
      unknown2 = eax;
      // Game.exe+10FE9 , jne Game.exe+10FFB,                                EAX=00000001 , EBX=00000000 , ECX=00000008 , EDX=00000008 , ESI=0019CF40 , EDI=0019D313
      if (ecx === 0x8) {
        // Game.exe+10FEB , add edi,01                                         EDI = 0019D314
        offset += 0x1;
        console.log((0x10feb).toHex(), "EDI =", offset.toHex());
        // Game.exe+10FEE , add dword ptr [esi+08],01                          EAX=00000001 , EBX=00000000 , ECX=00000008 , EDX=00000008 , ESI=0019CF40 , EDI=0019D314
        // Game.exe+10FF2 , mov [esi],edi                                      EAX=00000001 , EBX=00000000 , ECX=00000008 , EDX=00000008 , ESI=0019CF40 , EDI=0019D314
        // Game.exe+10FF4 , mov [esi+0C],00000000                              EAX=00000001 , EBX=00000000 , ECX=00000008 , EDX=00000008 , ESI=0019CF40 , EDI=0019D314
        unknown1 = 0x0;
        // Game.exe+10FFB , test eax,eax                                       EAX=00000001 , EBX=00000000 , ECX=00000008 , EDX=00000008 , ESI=0019CF40 , EDI=0019D314
        // Game.exe+10FFD , jg Game.exe+10FA3,                                 EAX=00000001 , EBX=00000000 , ECX=00000008 , EDX=00000008 , ESI=0019CF40 , EDI=0019D314
      }

      // debug.color(`Value (prompt): ${(0).toHex()}`, "green");
      // }

      console.log("");

      // ?
      // unknown1 -= ecx;
      // unknown2 -= ecx;
    }
  }

  // for (let i = 0x0; i < 0x2; i += 0x1) {
  //   let value = 0x0;

  //   for (let j = 0x0; j < 0x2; j += 0x1) {
  // arrayIndex = 8 - unknown1;

  // let int = getInt(offset, "uint8");
  // int &= masks1[arrayIndex];
  // int >>= 0x8 - arrayIndex;
  // int &= masks2[arrayIndex];

  // console.log(
  //   `(${getInt(offset, "uint8").toHex()} & ${masks1[arrayIndex].toHex()}) >> ${arrayIndex}`,
  // );

  //     if (j === 0x0) {
  //       value = int;
  //     } else {
  //       value = (value << 0x8) | int;
  //     }

  //     unknown -= 0x8;

  //     console.log(unknown);

  //     arrayIndex = unknown;

  //     // console.log(`0x${offset.toHex()}: ${int} (0x${int.toHex()})`);

  //     if (j === 0x0) {
  //       offset += 0x1;
  //     }
  //   }

  //   debug.color(`${i} | VALUE: ${value} (0x${value.toHex()})`, "green");
  // }
}

export function generateChecksum(item: ItemChecksum): number {
  const $dataView = get(dataView);

  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < $dataView.byteLength; i += 0x1) {
    const carry = checksum < 0x0 ? 0x1 : 0x0;

    checksum = ((checksum * 0x2) & 0xffffffff) + carry + getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
}
