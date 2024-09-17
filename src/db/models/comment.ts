import { DataTypes, Model, Optional } from "sequelize";
import connection from "../../config/dbConnect";

interface CommentAttributes {
  id?: number,
  comment: string,
  author: string,
  postId: bigint,
  userId: bigint,

  createdAt?: Date,
  updatedAt? : Date
}

export interface CommentInput extends Optional<CommentAttributes, 'id'>{ }
export interface CommentOutput extends Required<CommentAttributes>{ }

class Comment extends Model<CommentAttributes, CommentInput> implements CommentAttributes {
  public id!: number;
  public comment!: string;
  public author!: string;
  public postId!: bigint;
  public userId!: bigint;

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
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  }
}, {
  timestamps: true,
  sequelize: connection,
  underscored: false
});

export default Comment;