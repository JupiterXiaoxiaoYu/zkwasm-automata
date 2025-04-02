import { LeHexBN, ZKWasmAppRpc } from "zkwasm-ts-server";
import dotenv from 'dotenv';
import { Player } from "./api.js";
import { bnToHexLe,PrivateKey } from "delphinus-curves/src/altjubjub.js";

dotenv.config();

async function main() {
  try {
    const rpc = new ZKWasmAppRpc("http://127.0.0.1:3000");
    
    if (!process.env.SERVER_ADMIN_KEY) {
      throw new Error("SERVER_ADMIN_KEY not found in environment variables");
    }
    let admin = new Player(process.env.SERVER_ADMIN_KEY, rpc);
    let pkey = PrivateKey.fromString(admin.processingKey);
    let pubkey = pkey.publicKey.key.x.v;
    let leHexBN = new LeHexBN(bnToHexLe(pubkey));
    let pkeyArray = leHexBN.toU64Array();
    
    console.log("Installing admin...");
    await admin.installPlayer();
    
    const nonce = await admin.getNonce();
    console.log("Got nonce:", nonce.toString());

    console.log("Executing deposit...");
    console.log("Parameters:", {
      pid_1: pkeyArray[1],
      pid_2: pkeyArray[2], 
      tokenIndex: 0n,
      amount: 1n
    });

    console.log("Checking deposit...");
    const checkResult1 = await admin.checkDeposit(nonce, pkeyArray[1], pkeyArray[2], 0n, 1n); 
    console.log("Check deposit result:", JSON.stringify(checkResult1));
    
    console.log("deposit ...\n", pkeyArray[1], pkeyArray[2], admin.processingKey);
    await admin.deposit(nonce, pkeyArray[1], pkeyArray[2], 0n, 1n);
    
    console.log("Checking deposit...");
    const checkResult2 = await admin.checkDeposit(nonce, pkeyArray[1], pkeyArray[2], 0n, 1n); 
    console.log("Check deposit result:", JSON.stringify(checkResult2));
    
    if (checkResult2) {
      console.log("✅ Deposit check successful!");
    } else {
      console.log("❌ Deposit check failed!");
    }
    
  } catch (error) {
    console.error("Error occurred:", error);
    process.exit(1);
  }
}

main().catch(console.error);
