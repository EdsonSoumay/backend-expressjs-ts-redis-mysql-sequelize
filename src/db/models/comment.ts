import { DataTypes, Model, Optional } from "sequelize";
import connection from "../../config/dbConnect";
import User from "./User";

export interface CommentAttributes {
  id: number,
  comment: string,
  post_id: bigint,
  user_id: bigint,

  createdAt?: Date,
  updatedAt? : Date
}

export interface CommentInput extends Optional<CommentAttributes, 'id'>{ }
export interface CommentOutput extends Required<CommentAttributes>{ }

class Comment extends Model<CommentAttributes, CommentInput> implements CommentAttributes {
  public id!: number;
  public comment!: string;
  public post_id!: bigint;
  public user_id!: bigint;

  public readonly createdAt!: Date;
  public readonly updatedAt! : Date;
}

Comment.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  post_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  }
}, {
  timestamps: true,
  sequelize: connection,
  underscored: false
});


Comment.belongsTo(User, {
  foreignKey: 'user_id', // Kolom foreign key
  as: 'user' // Alias untuk relasi
});

export default Comment;