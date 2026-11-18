import { UserModel } from "../models/User.js"
import { UserCreationAttributes } from "../models/User.js"
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import { where } from "sequelize";
export const userService={
findByEmail:(email:string)=>{
const user=UserModel.findOne({
attributes:['id','name','phone','email','password','role','two_factor_enabled','two_factor_secret'],
where:{
email
},

})
return user
},
create:async(attributes:UserCreationAttributes)=>{
const user=await UserModel.create(attributes)
return user
},

findByFacebookId:async(instagramId:string)=>{
const user=await UserModel.findOne({
attributes:['id','name','phone','email','password','instagramId'],
where:{
instagramId
}

})
return user
},
findByLinkedinId:async(linkedinId:string)=>{
const user=await UserModel.findOne({
attributes:['id','name','phone','email','password','instagramId','linkedinId'],
where:{
linkedinId
}
})
return user
},
setup2fa: async (id: string) => {
const user = await UserModel.findByPk(id);
if (!user) throw new Error("Usuário não encontrado");

if (user.two_factor_enabled) {
throw new Error("2FA já configurado");
}

// Gerar secret
const secret = speakeasy.generateSecret({
name: `MeuPainelAdmin (${user.email})`
});

// Salvar secret temporariamente no banco
await UserModel.update(
{ two_factor_secret: secret.base32 },
{ where: { id: user.id } }
);
if (!secret.otpauth_url) {
throw new Error("Falha ao gerar a URL do Authenticator");
}
// Gerar QR Code
const qrCodeDataURL = await qrcode.toDataURL(secret.otpauth_url);

// Retornar os dados para o controller
return { qrCodeDataURL, secret: secret.base32 };
},
verify2fa: async (token: string, id: string) => {
const user = await UserModel.findByPk(id);
if (!user) throw new Error("Usuário não encontrado");
if (!user.two_factor_secret) throw new Error("2FA não configurado");



const verified = speakeasy.totp.verify({
secret: user.two_factor_secret,
encoding: "base32",
token,
window: 2
})
if (!verified) throw new Error("Código inválido");
if (!user.two_factor_enabled) {
user.two_factor_enabled = true;
await user.save();
}
return true;
}
,
reset2fa: async (id: string) => {
const user = await UserModel.findByPk(id);
if (!user) throw new Error("Usuário não encontrado");

// Usa o mesmo formato em todas as funções
const secret = speakeasy.generateSecret({
name: `MeuApp (${user.email})`, // mesmo "issuer" e label
});

await UserModel.update({two_factor_secret: secret.base32,two_factor_enabled: false},
{ where: { id: user.id } })
if (!secret.otpauth_url) {throw new Error("Falha ao gerar a URL do Authenticator");}
const qrCodeDataURL = await qrcode.toDataURL(secret.otpauth_url);
return {message: "2FA resetado com sucesso. Escaneie o novo QR Code.",qrCodeDataURL,secret: secret.base32,};},

get2faQRCode: async (userId: string) => {
const user = await UserModel.findByPk(userId);
if (!user) throw new Error("Usuário não encontrado");


if (!user.two_factor_secret) {
const secret = speakeasy.generateSecret({name: `MeuApp (${user.email})`});
user.two_factor_secret = secret.base32;
await user.save();
const qrCodeDataURL = await qrcode.toDataURL(secret.otpauth_url!);
return {message: "QR Code de 2FA gerado com sucesso.",qrCodeDataURL,secret: secret.base32}}

// Caso o usuário já tenha um secret, gera o QR Code correspondente
const existingSecret = user.two_factor_secret;
const otpauthUrl = `otpauth://totp/MeuApp (${user.email})?secret=${existingSecret}&issuer=MeuApp`;
const qrCodeDataURL = await qrcode.toDataURL(otpauthUrl);

return {message: "QR Code de 2FA existente retornado.",qrCodeDataURL,secret: existingSecret}}
}