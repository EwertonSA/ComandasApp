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

export const thumbnailResourceFeatures: FeatureType[] = [
  uploadFeature({
    provider: {
      local: {
        // Salva em 'public/uploads' para organização
        bucket: uploadDir,
        opts: {}
      }
    },
    properties: {
      key: "thumbnailUrl",    // campo que guarda o caminho no banco
      file: "uploadThumbnail" // campo virtual para upload
    },
    uploadPath: (record: BaseRecord, filename: string) => {
      // Se id ainda não existir (criação), usa timestamp para evitar erro
      const id = record.get("id") || `${Date.now()}`;
      // Organiza arquivos em pasta por produto
      return `produtos/produto-${id}/${filename}`;
    }
  })
];

export default ProdutosResourceOption;
