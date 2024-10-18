import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user_id?: string;  // Sesuaikan tipe datanya jika perlu
    }
  }
}
