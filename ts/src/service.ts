import { Service } from "zkwasm-ts-server";

const service = new Service(async ()=>{return;});

async function main() {
    await service.initialize();
    await service.serve();
}

await main();

