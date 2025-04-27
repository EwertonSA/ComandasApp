import { ResourceOptions } from "adminjs";

const UserResourceOptions:ResourceOptions={
    navigation:'Administração',
    editProperties:['name','phone','email','password','role'],
    filterProperties:['name','phone','email','password','role','createdAt','updatedAt'],
    listProperties:['id','name','phone','email','password','role'],
    showProperties:['name','phone','email','password','role','createdAt','updatedAt'],
   
    properties:{
        password:{
            type:'password',
            isVisible:{
                list: false,
                filter: false,
                show: false,
                edit: true,
            }
        },
        role:{
            type:'string',
            availableValues:[
                {value:'user',label:'Usuário'},
                {value:'cliente',label:'Cliente'}
            ]
        },
        
    },
}
export {UserResourceOptions}