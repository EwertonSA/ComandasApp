import { DataTypes, Model, Optional, ModelStatic } from "sequelize";
import { sequelize } from  "../database/index.js";
import bcrypt from "bcrypt";

// Definição dos tipos do usuário
export interface User {
  id: number;
  name?: string;
  phone?: string;
  email: string;
  password: string;
  role: "user" | "cliente";
}

// Tipo para criação de usuário (sem o 'id')
export interface UserCreationAttributes extends Optional<User, "id"> {}

// Tipagem para a instância do usuário, incluindo o método checkPassword
export interface UserInstance
  extends Model<User, UserCreationAttributes>, // Model base com tipagem de atributos e criação
    User {
  checkPassword(
    password: string,
    callbackfn: (err: Error | undefined, isSame: boolean) => void
  ): void;
}

// Definição do modelo do Sequelize
export const UserModel = sequelize.define<UserInstance, User>(
  "users",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    phone: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    password: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    role: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isIn: [["user", "cliente"]],
      },
    },
  },
  {
    hooks: {
      beforeSave: async (user, options) => {
        if (user.isNewRecord || user.changed("password")) {
          if (user.password) {
            console.log('Hashing password...');
            user.password = await bcrypt.hash(user.password.toString(), 10);
          }
        }
      },
    },
  }
) as ModelStatic<UserInstance> & { prototype: UserInstance & UserInstance };

// Adicionando o método checkPassword corretamente ao protótipo
UserModel.prototype.checkPassword = function (
  this: UserInstance,
  password: string,
  callbackfn: (err: Error | undefined, isSame: boolean) => void
) {
  if(!this.password){
    return callbackfn(new Error("Senha não cadastrada"),false)
  }
  console.log('Senha digitada:', password);
  console.log('Senha salva no banco (hash):', this.password);
  bcrypt.compare(password, this.password!, (err, isSame) => {
   
    if (err) {
      callbackfn(err, false);
      console.log('Erro ao comparar as senhas:', err); // Log de erro adicional
    } else {
      callbackfn(undefined, isSame);
      console.log('Resultado da comparação (isSame):', isSame);
    }
  });
};
