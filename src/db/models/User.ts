import { DataTypes, Model, Optional } from "sequelize";
import connection from "../../config/dbConnect";

export interface UserAttributes {
	id: bigint,
	username: string,
	first_name: string,
	last_name: string,
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
	public first_name!: string;
	public last_name!: string;
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
	first_name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	last_name: {
		type: DataTypes.STRING,
		allowNull: true
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