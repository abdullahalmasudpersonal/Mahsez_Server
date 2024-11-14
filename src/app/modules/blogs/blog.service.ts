import { Request } from 'express';
import { Blog } from './blog.modal';
import AppError from '../../errors/AppError';
import { IUploadFile } from '../../interface/file';

const createBlogIntoDB = async (req: Request) => {
  const user = req.user;
  const blogData = req.body;
  const existsBlog = await Blog.findOne({ title: blogData.title });
  if (existsBlog) {
    throw new AppError(409, 'User Alrady Exists!');
  }

  const file = req.file as IUploadFile;
  blogData.image = file?.path;
  blogData.writer = user.email;

  const createBlog = await Blog.create(blogData);
  return createBlog;
};

const getBlogsIntoDB = async () => {
  return await Blog.find().sort({ createdAt: -1 });
};

const getSingleBlogIntoDB = async (req: Request) => {
  const blogId = req.params.id;
  return await Blog.findById({ _id: blogId });
};

const updateSingleBlogIntoDB = async (req: Request) => {
  const blogId = req.params.id;
  const updateData = req.body;
  return await Blog.findByIdAndUpdate({ _id: blogId }, { $set: updateData });
};

const deleteBlogIntoDB = async (req: Request) => {
  const blogId = req.params.id;
};
export const BlogServices = {
  createBlogIntoDB,
  getBlogsIntoDB,
  getSingleBlogIntoDB,
  updateSingleBlogIntoDB,
  deleteBlogIntoDB,
};
