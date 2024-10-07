import { DataTypes, Model, Optional } from "sequelize";
import connection from "../../config/dbConnect";

export interface UserAttributes {
	id: bigint,
	username: string,
	email: string,
	password: string,
  
	createdAt?: Date,
	updatedAt? : Date
  }
  
  export interface UserInput extends Optional<UserAttributes, 'id'>{ }
  export interface UserOutput extends Required<UserAttributes>{ }
  
  class User extends Model<UserAttributes, UserInput> implements UserAttributes {
	public id!: bigint;
	public username!: string;
	public email!: string;
	public password!: string;

	public readonly createdAt!: Date;
	public readonly updatedAt! : Date;
}


User.init({
	id: {
		type: DataTypes.BIGINT,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false
	},
	username: {
		type: DataTypes.STRING,
		allowNull: false
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false
	},
}, {
	timestamps: true,
	sequelize: connection,
	underscored: false
});

// User.belongsTo(Role, { foreignKey: "roleId" });

export default User;