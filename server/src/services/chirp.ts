import { FilterQuery, PopulateOptions, SortOrder, Types } from 'mongoose';
import Chirp, {
  IChirp,
  IPost,
  IReply,
  PostChirp,
  ReplyChirp,
} from '../models/Chirp';
import Like, { ILike } from '../models/Like';
import { CHIRP_DEFAULT_FIELD } from '../schemas';

export const findMany = async (
  filter: FilterQuery<IChirp>,
  select = CHIRP_DEFAULT_FIELD,
  populate: PopulateOptions[] = [],
  sort?: { [key: string]: SortOrder | { $meta: 'textScore' } },
  limit?: number,
  skip?: number
) => {
  const query = Chirp.find(filter)
    .select(select)
    // .select({ score: { $meta: 'textScore' } })
    .populate(populate)
    .sort(sort);
  if (limit) query.limit(limit);
  if (skip) query.skip(skip);
  const chirps = await query;
  return chirps;
};

export const findOne = async (
  id: Types.ObjectId,
  select = CHIRP_DEFAULT_FIELD,
  populate: PopulateOptions[] = []
) => {
  const chirp = await Chirp.findById(id).select(select).populate(populate);
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
  const parentChirp = await findOne(parentId);

  const parent = parentChirp._id;
  const post = parentChirp instanceof ReplyChirp ? parentChirp.post : parent;

  const reply = await ReplyChirp.create<Omit<IReply, 'metrics' | 'replies'>>({
    content,
    author,
    post,
    parent,
  });
  return reply._id;
};

const createPost = async (content: string, author: Types.ObjectId) => {
  const post = await PostChirp.create<Omit<IPost, 'metrics' | 'replies'>>({
    content,
    author,
  });
  return post._id;
};

export const createOne = async (
  content: string,
  author: Types.ObjectId,
  parentId?: Types.ObjectId
) => {
  const chirpId = parentId
    ? await createReply(content, author, parentId)
    : await createPost(content, author);
  return chirpId;
};

export const deleteOne = async (id: Types.ObjectId) => {
  const chirp = await findOne(id);
  await chirp.remove();
};

export const findLikingUsersIds = async (
  chirp: Types.ObjectId,
  limit: number,
  sinceId?: Types.ObjectId
) => {
  const filter: FilterQuery<ILike> = { chirp };
  if (sinceId) {
    filter._id = { $lt: sinceId };
  }

  const likes = await Like.find(filter).sort({ _id: -1 }).limit(limit);
  const likingUsersIds = likes.map((like) => like.user);
  const oldestId = likes[likes.length - 1]?._id;
  return { likingUsersIds, oldestId };
};
