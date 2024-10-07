import { Op } from "sequelize";
import Post, { PostAttributes } from "../db/models/post";
import User from "../db/models/User";
import fs from 'fs'
import Comment from "../db/models/comment";
import { deleteImage, removePreviousImage } from "../helpers/RemoveFileHelper";
import Category from "../db/models/category";

const getPostsService = async (search: any) => {
    let result;
    if (search) {
        result = await Post.findAll({
          where: {
            title: {
              [Op.like]: `%${search}%`,
            },
          },
          include: [{
            model: User,
            as: 'user' // Alias yang digunakan di relasi
        }]
        });
      } else {
        result = await Post.findAll({
          include: [{
            model: User,
            as: 'user' // Alias yang digunakan di relasi
        }]
        });
      }
      return result;
}

const createPostService = async (value:PostAttributes) => {
  const result = await Post.create(value);
  return result.dataValues;
}

const updatePostService = async (id: string, value:PostAttributes) => {
  const getPreviousPost = await Post.findOne({where:{id}})
  removePreviousImage(value?.photo, getPreviousPost?.photo)
  
  if(value.photo === null && getPreviousPost?.photo){
    value.photo = getPreviousPost?.photo;
  }
  const updatePost = await Post.update(value, { where: { id } });
  return updatePost;
}

const deletePostService = async (id: string) => {
  const findPOst = await Post.findOne({where:{id}})
  await Post.destroy({where:{id}})
  await Comment.destroy({where:{post_id:id}})
  deleteImage(findPOst?.photo)
  return true;
}

const getPostByUserService = async(user_id:string)=>{
  const result = await Post.findAll({
    where:{user_id},
    include: [
      {
        model: Category,
        as: 'category' // Alias yang digunakan di relasi
      },
      {
        model: User,
        as: 'user' // Alias yang digunakan di relasi
      }
     ]
  });
  return result;
}

const getPostService = async (id:string) => {

  const result = await Post.findOne({
    where: {id}, 
    include: [
        {
          model: Category,
          as: 'category' // Alias yang digunakan di relasi
        },
        {
          model: User,
          as: 'user' // Alias yang digunakan di relasi
        }
      ]
  });
  return result;
}

export {getPostsService, createPostService, updatePostService, deletePostService, getPostByUserService, getPostService}