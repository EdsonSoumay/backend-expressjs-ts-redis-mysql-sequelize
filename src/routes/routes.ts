import { Application } from "express";
import AuthController from "../controllers/AuthController";
import Authorization from "../middleware/Authorization";
import UserController from "../controllers/UserController";
import PostController from "../controllers/PostController";
import CommentController from "../controllers/CommentController";
import FileController from "../controllers/FileController";
import HandleFile from "../middleware/HandleFile";

export const routes = (app: Application)=>{
 app.post("/api/auth/register", AuthController.register);
 app.post("/api/auth/login",  AuthController.login);
 app.get("/api/auth/refetch", AuthController.refetch);
 app.get("/api/auth/logout", Authorization.verifyToken, AuthController.logout);

 app.get("/api/users/:id", Authorization.verifyToken, UserController.getUser);
 app.put("/api/users/:id", Authorization.verifyToken, UserController.updateUser);
 app.delete("/api/users/:id", Authorization.verifyToken, UserController.deleteUser);

 app.post("/api/posts/create", Authorization.verifyToken, PostController.createPost);
 app.put("/api/posts/:id", Authorization.verifyToken, PostController.editPost);
 app.delete("/api/posts/:id", Authorization.verifyToken, PostController.deletePost);
 app.get("/api/posts/:id", Authorization.verifyToken, PostController.getPost);
 app.get("/api/posts", Authorization.verifyToken, PostController.getPosts);
 app.get("/api/posts/user/:userId", Authorization.verifyToken, PostController.getPostsByUser);  

 app.post("/api/comments/create/", Authorization.verifyToken, CommentController.createComment);
 app.put("/api/comments/:id/", Authorization.verifyToken, CommentController.editComment);
 app.delete("/api/comments/:id/", Authorization.verifyToken, CommentController.deleteComment);
 app.get("/api/comments/post/:postId/", Authorization.verifyToken, CommentController.getPostComments);

 app.post("/api/upload",HandleFile.fileUpload(), FileController.handleFileUpload)
}