import uploadFeature from "@adminjs/upload/build/features/upload-file.js";
import { FeatureType, ResourceOptions, BaseRecord } from "adminjs";
import path from "path";
import fs from "fs";

// Garantir que a pasta para uploads exista
const uploadDir = path.join(__dirname, "..", "..", "..", "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const ProdutosResourceOption: ResourceOptions = {
  navigation: "Comandas",
  showProperties: ["id", "categoria", "nome", "descricao", "preco", "thumbnailUrl"],
  editProperties: ["categoria", "nome", "descricao", "uploadThumbnail", "preco"],
  filterProperties: ["id", "categoria", "nome", "descricao", "preco"],
  listProperties: ["id", "categoria", "nome", "descricao", "preco"]
};

export const thumbnailResourceFeatures = [
  uploadFeature({
    provider: {
      local: {
        bucket: uploadDir,
      },
    },
    properties: {
      key: 'thumbnailUrl',       // campo no banco que vai armazenar o caminho da imagem
      file: 'uploadThumbnail',   // campo temporário usado no painel para upload
    },
    uploadPath: (record:any, filename:any) => {
      const id = record?.id || Date.now()
      return `produtos/produto-${id}/${filename}`
    },
  }),
]

export default ProdutosResourceOption;
