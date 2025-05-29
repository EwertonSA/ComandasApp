import uploadFeature from "@adminjs/upload/build/features/upload-file.js";
import { FeatureType, ResourceOptions, BaseRecord } from "adminjs";
import path from "path";

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
        bucket: path.join(__dirname, "..", "..", "..", "public"),
        opts: {}
      }
    },
    properties: {
      key: "thumbnailUrl",
      file: "uploadThumbnail"
    },
    uploadPath: (record: BaseRecord, filename: string) =>
      `thumbnailUrl/produtos-${record.get("id")}/${filename}`
  })
];

export default ProdutosResourceOption;
