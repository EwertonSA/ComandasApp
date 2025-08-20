import { UserModel } from "../models/User.js"
import { UserCreationAttributes } from "../models/User.js"
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import { where } from "sequelize";
export const userService={
findByEmail:(email:string)=>{
    const user=UserModel.findOne({
        attributes:['id','name','phone','email','password','two_factor_enabled','two_factor_secret'],
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
      window: 1
    });

    if (!verified) throw new Error("Código inválido");

    // Ativar 2FA caso ainda não esteja
    if (!user.two_factor_enabled) {
      user.two_factor_enabled = true;
      await user.save();
    }

    return true; // retorna algo para indicar sucesso
  }


}