import { FeatureType, ResourceOptions } from "adminjs";
import uploadFileFeature from "@adminjs/upload";
import path from "path"
const ProdutosResourceOption:ResourceOptions={
    navigation:"Comandas",
    showProperties:['id','categoria','nome','descricao','preco','thumbnailUrl'],
    editProperties:['categoria','nome','descricao','uploadThumbnail','preco'],
   
    filterProperties:['id','categoria','nome','descricao','preco'],
    listProperties:['id','categoria','nome','descricao','preco']
    
}
export const thumbnailResourceFeatures: FeatureType[]=[
    uploadFileFeature({
        provider:{
            local:{
                bucket: path.join(__dirname,'..','..','..','public')
            }
        },
        properties:{
            key:'thumbnailUrl',
            file:'uploadThumbnail'
        },
        uploadPath:(record,filename)=>`thumbnailUrl/produtos-${record.get('produtoId')}/${filename}`
    })
]
export default  ProdutosResourceOption