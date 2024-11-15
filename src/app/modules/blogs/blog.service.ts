import { Request } from 'express';
import { Blog } from './blog.modal';
import AppError from '../../errors/AppError';
import { IUploadFile } from '../../interface/file';
import { Admin } from '../admin/admin.model';

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
  const blogs = await Blog.aggregate([
    {
      $lookup: {
        from: 'admins',
        localField: 'writer',
        foreignField: 'email',
        as: 'writerInfo',
      },
    },
    {
      $unwind: {
        path: '$writerInfo',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        description2: 1,
        features2: 1,
        image: 1,
        isDeleted: 1,
        createdAt: 1,
        updatedAt: 1,
        writer: {
          $ifNull: ['$writerInfo.name', '$writer'],
        },
      },
    },
  ]);
  return blogs;
};

const getSingleBlogIntoDB = async (req: Request) => {
  const blogId = req.params.id;
  return await Blog.findById({ _id: blogId });
};

const updateSingleBlogIntoDB = async (req: Request) => {
  const blogId = req.params.id;
  const updateData = req.body;
  const file = req.file as IUploadFile;
  updateData.image = file?.path;
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
