import { FilterQuery, PopulateOptions, Types } from 'mongoose';
import ChirpModel, { PostChirp, ReplyChirp } from './chirp.model';
import * as likeService from '../likes/like.service';
import { SortQuery } from '../../interfaces';
import { Chirp, MetricsField, Post, Reply } from './chirp.interfaces.';
import { Like } from '../likes/like.interfaces';
import config from '../../config/request.config';

const defaultFields = config.chirp.fields.default;

const findMany = async (
  filter: FilterQuery<Chirp>,
  select: string = defaultFields,
  populate: PopulateOptions[] = [],
  sort?: SortQuery,
  limit?: number,
  skip?: number
) => {
  const query = ChirpModel.find(filter)
    .select(select)
    // .select({ score: { $meta: 'textScore' } })
    .populate(populate)
    .sort(sort);

  if (limit) query.limit(limit);
  if (skip) query.skip(skip);

  const chirps = await query;

  return chirps;
};

const findOne = async (
  id: Types.ObjectId,
  select: string = defaultFields,
  populate: PopulateOptions[] = []
) => {
  const chirp = await ChirpModel.findById(id).select(select).populate(populate);

  if (!chirp) {
    throw new Error('Sorry, we could not find that chirp');
  }

  return chirp;
};

const createReply = async (
  content: string,
  author: Types.ObjectId,
  parentId: Types.ObjectId
) => {
  const parentChirp = await findOne(parentId, 'post');

  const parent = parentChirp._id;
  const post = parentChirp instanceof ReplyChirp ? parentChirp.post : parent;

  const reply = await ReplyChirp.create<Omit<Reply, 'metrics' | 'replies'>>({
    content,
    author,
    post,
    parent,
  });

  return reply._id;
};

const createPost = async (content: string, author: Types.ObjectId) => {
  const post = await PostChirp.create<Omit<Post, 'metrics' | 'replies'>>({
    content,
    author,
  });

  return post._id;
};

const createOne = async (
  content: string,
  author: Types.ObjectId,
  parentId?: Types.ObjectId
) => {
  const chirpId = parentId
    ? await createReply(content, author, parentId)
    : await createPost(content, author);

  return chirpId;
};

const deleteOne = async (id: Types.ObjectId) => {
  const chirp = await findOne(id, 'author parent replies');
  await chirp.remove();
};

const findLikingUsersIds = async (
  chirp: Types.ObjectId,
  limit: number,
  sinceId?: Types.ObjectId
) => {
  const filter: FilterQuery<Like> = { chirp };
  if (sinceId) filter._id = { $lt: sinceId };

  const likes = await likeService.findMany(
    filter,
    'user',
    undefined,
    { _id: -1 },
    limit
  );

  const likingUsersIds = likes.map((like) => like.user);
  const nextPage =
    likes.length === limit ? likes[likes.length - 1]._id : undefined;

  return { likingUsersIds, nextPage };
};

const incrementMetrics = async (
  id: Types.ObjectId,
  ...metricsField: MetricsField[]
) => {
  const chirp = await findOne(id, 'metrics');
  const uniqueMetricsField = [...new Set(metricsField)];

  uniqueMetricsField.forEach((field) => {
    chirp.metrics[field]++;
  });

  await chirp.save();
};

const decrementMetrics = async (
  id: Types.ObjectId,
  ...metricsField: MetricsField[]
) => {
  const chirp = await findOne(id, 'metrics');
  const uniqueMetricsField = [...new Set(metricsField)];

  uniqueMetricsField.forEach((field) => {
    chirp.metrics[field]--;
  });

  await chirp.save();
};

const deleteMany = async (filter: FilterQuery<Chirp>) => {
  const chirps = await findMany(filter, 'author parent replies');
  await Promise.all(chirps.map((chirp) => chirp.remove()));
};

const pushReply = async (id: Types.ObjectId, replyId: Types.ObjectId) => {
  const chirp = await findOne(id, 'replies');
  chirp.replies.push(replyId);
  await chirp.save();
};

const pullReply = async (id: Types.ObjectId, replyId: Types.ObjectId) => {
  const chirp = await ChirpModel.findById(id, 'replies');
  if (chirp) {
    chirp.replies = chirp.replies.filter((id) => !id.equals(replyId));
    await chirp.save();
  }
};

export {
  findMany,
  findOne,
  createOne,
  deleteOne,
  findLikingUsersIds,
  incrementMetrics,
  decrementMetrics,
  deleteMany,
  pushReply,
  pullReply,
};
