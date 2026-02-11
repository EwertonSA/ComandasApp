//import { Sequelize } from "sequelize";
//import { DATABASE_URL } from "../config/environment.js";

//export const sequelize= new Sequelize(DATABASE_URL,{
  //  define:{
    //    underscored:true
    //}
//})
import { Sequelize } from "sequelize";
import { DATABASE_URL } from "../config/environment.js";

export const sequelize = new Sequelize(DATABASE_URL, {
  define: {
    underscored: true
  }
});

// Função para conectar ao banco com retry
export async function connectDatabase(retries = 5, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      console.log("✅ Conectado ao PostgreSQL com sucesso!");
      return;
    } catch (err:any) {
      console.error(`❌ Falha ao conectar (tentativa ${i + 1}): ${err.message}`);
      if (i < retries - 1) await new Promise(res => setTimeout(res, delay));
      else throw err; // Se não conseguir após todas as tentativas, lança o erro
    }
  }
}
