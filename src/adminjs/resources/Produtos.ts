import path from "path";
import fs from "fs";
import RecordInstance from "adminjs"
import { FeatureType, ResourceOptions } from "adminjs";
import uploadFileFeature from "@adminjs/upload";
import { componentLoader } from "./dashboard.js";
const supabaseS3AccessKeyId = process.env.SUPABASE_S3_ACCESS_KEY_ID;
const supabaseS3SecretAccessKey = process.env.SUPABASE_S3_SECRET_ACCESS_KEY;
const supabaseEndpoint = process.env.SUPABASE_ENDPOINT;

if (!supabaseS3AccessKeyId || !supabaseS3SecretAccessKey || !supabaseEndpoint) {
throw new Error("SUPABASE_S3_ACCESS_KEY_ID, SUPABASE_S3_SECRET_ACCESS_KEY e SUPABASE_ENDPOINT devem estar configurados para o upload de thumbnails.");
}

const supabaseS3Options = {
bucket: 'Produtos-thumbnail',
region: process.env.SUPABASE_REGION || 'us-east-1',
credentials: {
accessKeyId: supabaseS3AccessKeyId,
secretAccessKey: supabaseS3SecretAccessKey,
},
endpoint: supabaseEndpoint,
forcePathStyle: true,
};

const uploadDir = path.join(process.cwd(), "public");
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
type: "mixed",
},
thumbnailUrl: {
isVisible: { list: true, filter: true, show: true, edit: false },
},
},
}
export const thumbnailResourceFeatures:FeatureType[]=[
uploadFileFeature({
componentLoader,provider: {
aws: supabaseS3Options,
},
properties:{key:'thumbnailUrl', file:'uploadThumbnail'},
uploadPath:(record:any, filename:string)=> `thumbnailUrl/products-${record.get('id')}/${filename}`
})
]
export default ProdutosResourceOption