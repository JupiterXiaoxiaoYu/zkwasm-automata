import {PrivateKey, bnToHexLe} from "delphinus-curves/src/altjubjub";
import {Player} from "./api.js";
import {LeHexBN, ZKWasmAppRpc} from "zkwasm-minirollup-rpc";
import dotenv from 'dotenv';
dotenv.config();

const rpc = new ZKWasmAppRpc("http://127.0.0.1:3000");

let account = "1234";
let player = new Player(account, rpc);

let admin = new Player(process.env.SERVER_ADMIN_KEY!, rpc);

let pkey = PrivateKey.fromString(player.processingKey);
let pubkey = pkey.publicKey.key.x.v;
let leHexBN = new LeHexBN(bnToHexLe(pubkey));
let pkeyArray = leHexBN.toU64Array();

async function main() {
  let config = await player.getConfig();
  let r;
  console.log("config", config);

  console.log("install player ...\n");
  await player.installPlayer();

  console.log("install admin ...\n");
  await admin.installPlayer();

  console.log("deposit ...\n", pkeyArray[1], pkeyArray[2], admin.processingKey);
  r = await admin.deposit(pkeyArray[1], pkeyArray[2], 0n, 10n);
  console.log("result", r);

  console.log("install object ...\n");
  r = await player.installObject(0n, [0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n]);
  console.log("result", r);

  console.log("install card...\n");
  r = await player.installCard();
  console.log("result", r);


  console.log("restart object ...\n");
  r = await player.restartObject(0n, [0n, 0n, 0n, 0n, 0n, 0n, 0n, 4n]);
  console.log("result", r);

  console.log("upgrade object ...\n");
  r = await player.upgradeObject(0n, 1n);
  console.log("result", r);


  let state = await player.getState();
  console.log("query state:", state);

  /*
  console.log("withdraw:\n");
  await player.withdrawRewards("c177d1d314C8FFe1Ea93Ca1e147ea3BE0ee3E470", 1n);
  */
}

main();
