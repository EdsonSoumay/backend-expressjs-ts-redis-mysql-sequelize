import { Request, Response } from "express";
import { createPostValidation, updatePostValidation } from "../validations/post.validation";
import { createPostService, deletePostService, getPostByUserService, getPostService, getPostsService, updatePostService } from "../services/post.service";

const getPosts = async (req: Request, res: Response): Promise<Response> => {
  const { search } = req.query;
  const redisClient = req.app.locals.redisClient;

  // Cek status koneksi Redis
  const isRedisClientOpen = redisClient.isOpen; // Periksa jika client Redis terbuka

  // Buat cache key yang unik berdasarkan parameter pencarian
  const searchStr = String(search || '').toLowerCase(); // Memastikan selalu string
  const cacheKey = searchStr ? `posts:search:${searchStr}` : 'posts:all';

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
    const posts = await getPostsService(search)

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
	const { error, value } = createPostValidation(req.body)
    if(error){
      console.log("error validation:",error.details[0].message)
      return res.status(404).send({message: error.details[0].message })
    }
    try {
        const result = await createPostService(value)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(501).json(error)       
    }
}

const editPost  = async (req: Request, res: Response): Promise<Response> =>{
    const {id} = req.params;
    const { error, value } = updatePostValidation(req.body)
   
    if(error){
      console.log("error validation:",error.details[0].message)
      return res.status(404).send({message: error.details[0].message })
    }

    try {
        const result = await updatePostService(id,value)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(501).json(error)       
    }
}

const deletePost  = async (req: Request, res: Response): Promise<Response> =>{
  const {id} = req.params;
  try {
       const result = await deletePostService(id)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(501).json(error)       
    }
}

const getPost  = async (req: Request, res: Response): Promise<Response> =>{
    const {id} = req.params;
    try {
      const result = await getPostService(id)
      return res.status(200).json(result)
    } catch (error) {
        return res.status(501).json(error)       
    }
}

const getPostsByUser  = async (req: Request, res: Response): Promise<Response> =>{
    const {user_id} = req.params;
    try {
        const result = await getPostByUserService(user_id)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(501).json(error)       
    }
}

export default {createPost, editPost, deletePost, getPost, getPosts, getPostsByUser};