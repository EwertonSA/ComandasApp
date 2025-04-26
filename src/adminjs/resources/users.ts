import { ResourceOptions } from "adminjs";

const UserResourceOptions:ResourceOptions={
    navigation:'Administração',
    properties:{
        password:{
            isVisible:{
                list: false,
                filter: false,
                show: false,
                edit: true,
            }
        },
        role:{
            availableValues:[
                {value:'user',label:'Usuário'},
                {value:'cliente',label:'Cliente'}
            ]
        },
        
    },
    editProperties:['name','phone','email','password','role'],
    filterProperties:['name','phone','email','password','role','createdAt','updatedAt'],
    listProperties:['id','name','phone','email','password'],
    showProperties:['name','phone','email','password','role','createdAt','updatedAt']

}
export {UserResourceOptions}