import { Request, Response } from "express";
import { Op, col } from "sequelize";
import Post from "../db/models/post";
import Comment from "../db/models/comment";
import fs from 'fs'

const getPosts = async (req: Request, res: Response): Promise<Response> => {
  const { search } = req.query;
  const redisClient = req.app.locals.redisClient;

  // Cek status koneksi Redis
  const isRedisClientOpen = redisClient.isOpen; // Periksa jika client Redis terbuka

  // Buat cache key yang unik berdasarkan parameter pencarian
  const cacheKey = search ? `posts:search:${search}` : 'posts:all';

  try {
    if (isRedisClientOpen) {
      // Cek apakah data sudah ada di Redis
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        const data = JSON.parse(cachedData)
        console.log("redis data:", data);
        // Data ditemukan di Redis, kembalikan data dari cache
        return res.status(200).json(data);
      }
    }

    // Jika tidak ada di Redis atau Redis tidak tersedia, fetch data dari database
    let posts;
    if (search) {
      posts = await Post.findAll({
        where: {
          title: {
            [Op.like]: `%${search}%`,
          },
        },
        attributes: {
          include: [[col('id'), '_id']],
        },
      });
    } else {
      posts = await Post.findAll({
        attributes: {
          include: [[col('id'), '_id']],
        },
      });
    }

    if (isRedisClientOpen) {
      // Simpan data ke Redis untuk caching dengan TTL 300 detik (5 menit)
      await redisClient.set(cacheKey, JSON.stringify(posts), {
        EX: 300,
      });
    }

    // Kembalikan data
    return res.status(200).json(posts);
  } catch (err) {
    console.log("error:", err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createPost  = async (req: Request, res: Response): Promise<Response> =>{
    try {
        const newPost = await Post.create(req.body);
        return res.status(200).json(newPost.dataValues)
    } catch (error) {
        return res.status(501).json(error)       
    }
}

const editPost  = async (req: Request, res: Response): Promise<Response> =>{
    const {id} = req.params;
    const {title, desc, photo} = req.body;
    try {
        const getPreviousPost = await Post.findOne({where:{id}})
       
        if (photo && getPreviousPost?.photo) {
          const filePath = getPreviousPost?.photo;
          if (filePath) {
              fs.unlink(`public/images/${filePath}`, (err) => {
                if (err) {
                    console.error('Error deleting the file:', err);
                } else {
                    console.log('File deleted successfully');
                }
            });
           }
         }
       
        const updatePost = await Post.update({title, desc, photo}, { where: { id } });
        return res.status(200).json(updatePost)
    } catch (error) {
        return res.status(501).json(error)       
    }
}

const deletePost  = async (req: Request, res: Response): Promise<Response> =>{
  const {id} = req.params;
  try {
        await Post.destroy({where:{id}})
        await Comment.destroy({where:{postId:id}})
        return res.status(200).json(true)
    } catch (error) {
        return res.status(501).json(error)       
    }
}

const getPost  = async (req: Request, res: Response): Promise<Response> =>{
    const {id} = req.params;
    try {

        const post = await Post.findOne({
            where: {id},
            attributes: {
              include: [[col('id'), '_id']]
            }
          });

        return res.status(200).json(post)
    } catch (error) {
        return res.status(501).json(error)       
    }
}

const getPostsByUser  = async (req: Request, res: Response): Promise<Response> =>{
    const {userId} = req.params;
    try {
        const posts = await Post.findAll({
            where:{userId},
            attributes: {
                include: [[col('id'), '_id']]
              }
        });
        return res.status(200).json(posts)
    } catch (error) {
        return res.status(501).json(error)       
    }
}

export default {createPost, editPost, deletePost, getPost, getPosts, getPostsByUser};