import { DataTypes, Model, Optional } from "sequelize";
import connection from "../../config/dbConnect";

interface PostAttributes {
  id?: number,
  title: string,
  desc: string,
  photo: string | null,
  username: string,
  userId: bigint,

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
  public username!: string;
  public userId!: bigint;

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
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false
  }
}, {
  timestamps: true,
  sequelize: connection,
  underscored: false
});

export default Post;