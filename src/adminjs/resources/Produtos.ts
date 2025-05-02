import { ResourceOptions } from "adminjs";

const ProdutosResourceOption:ResourceOptions={
    navigation:"Comandas",
    showProperties:['id','categoria','nome','descricao','preco','thumbnailUrl'],
    editProperties:['categoria','nome','descricao','uploadThumbnail','preco'],
   
    filterProperties:['id','categoria','nome','descricao','preco'],
    listProperties:['id','categoria','nome','descricao','preco']
    
}
export default  ProdutosResourceOption