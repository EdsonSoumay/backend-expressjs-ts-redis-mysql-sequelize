import { DataTypes, Model, Optional } from "sequelize";
import connection from "../../config/dbConnect";
import Category from './category'; // Import Category model
import User from "./User";

export interface PostAttributes {
  id?: number,
  title: string,
  desc: string,
  photo: string | null,
  user_id: bigint,
  category_id: bigint,

  createdAt?: Date,
  updatedAt? : Date
}

export interface PostInput extends Optional<PostAttributes, 'id'>{ }
export interface PostOutput extends Required<PostAttributes>{ }

class Post extends Model<PostAttributes, PostInput> implements PostAttributes {
  public id!: number;
  public title!: string;
  public desc!: string;
  public photo!: string | null;
  public user_id!: bigint;
  public category_id!: bigint;

  public readonly createdAt!: Date;
  public readonly updatedAt! : Date;
}

Post.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  desc: {
    type: DataTypes.STRING,
    allowNull: false
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  category_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  }
}, {
  timestamps: true,
  sequelize: connection,
  underscored: false
});

Post.belongsTo(Category, {
  foreignKey: 'category_id', // Kolom foreign key
  as: 'category' // Alias untuk relasi
});

Post.belongsTo(User, {
  foreignKey: 'user_id', // Kolom foreign key
  as: 'user' // Alias untuk relasi
});

export default Post;