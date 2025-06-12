// ProdutosResource.ts

import path from "path";
import fs from "fs";
import uploadFeature from "@adminjs/upload/build/features/upload-file.js";
import Produtos from "../../models/Produtos.js";
import { FeatureType, ResourceOptions } from "adminjs";
import uploadFileFeature from "@adminjs/upload";

const uploadDir = path.join(__dirname, "..", "..", "public", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const ProdutosResourceOption:ResourceOptions={

    navigation: "Comandas",
    showProperties: ["id", "categoria", "nome", "descricao", "preco", "thumbnailUrl"],
    editProperties: ["categoria", "nome", "descricao", "uploadThumbnail", "preco"],
    listProperties: ["id", "categoria", "nome", "descricao", "preco"],
    filterProperties: ["id", "categoria", "nome", "descricao", "preco"],
    properties: {
      uploadThumbnail: {
       
        type: "mixed", // Pode ser omitido também
      },
      thumbnailUrl: {
        isVisible: { list: true, filter: true, show: true, edit: false },
      },
    },
  }
 export const thumbnailResourceFeatures:FeatureType[]=[
  uploadFileFeature({
    provider:{
      local:{uploadDir,opts:{}}
    },
     properties: {
        key: "thumbnailUrl",        // onde o caminho é salvo no banco
        file: "uploadThumbnail",    // campo usado para upload no AdminJS
      },
      uploadPath: (record:any, filename:any) => {
        const id = record?.id || Date.now();
        return `produtos/produto-${id}/${filename}`;
      },
  })
 


  ]
export default ProdutosResourceOption