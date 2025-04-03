import { ZKWasmAppRpc } from "zkwasm-ts-server";
import dotenv from 'dotenv';
import { Player } from "./api.js";
dotenv.config();
async function main() {
    try {
        const rpc = new ZKWasmAppRpc("https://127.0.0.1:8080");
        if (!process.env.SERVER_ADMIN_KEY) {
            throw new Error("SERVER_ADMIN_KEY not found in environment variables");
        } 
        const pid_1 = BigInt.asUintN(64, BigInt("-1"))
        const pid_2 = BigInt.asUintN(64, BigInt("1"))
        const amount = 1200n
        const nonce = 26733n
        let admin = new Player(process.env.SERVER_ADMIN_KEY, rpc);
        const checkResult1 = await admin.checkDeposit(nonce, pid_1, pid_2, 0n, amount);
        console.log("Check deposit result:", JSON.stringify(checkResult1));
    }
    catch (error) {
        console.error("Error occurred:", error);
        process.exit(1);
    }
}
main().catch(console.error);
//# sourceMappingURL=testCheckDeposit.js.map