import crypto from "crypto";

const  gerarHashComanda=(comandaId: string): string=> {
  return crypto
    .createHmac("sha256", process.env.HASH_SECRET!) // usa uma chave secreta do .env
    .update(comandaId)
    .digest("hex");
}
export default gerarHashComanda