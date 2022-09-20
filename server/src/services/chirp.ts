/* eslint-disable prefer-rest-params */
import { FilterQuery, PopulateOptions, SortOrder, Types } from 'mongoose';
import Chirp, {
  IChirp,
  IPost,
  IReply,
  PostChirp,
  ReplyChirp,
} from '../models/Chirp';
import Follow from '../models/Follow';
import { CHIRP_DEFAULT_FIELD } from '../schemas';
// import Like from '../models/Like';

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
  // if (select) query.select(select);
  // if (populate) query.populate(populate);
  // if (sort) query.sort(sort);
  if (limit) query.limit(limit);
  if (skip) query.skip(skip);
  const chirps = await query;
  return chirps;
};

// export const findMany = async (
//   ids: Types.ObjectId[],
//   select: string,
//   populate: PopulateOptions[]
// ) => {
//   const foundChirps = await Chirp.find({ _id: ids })
//     .select(select)
//     .populate(populate);
//   return foundChirps;
// };

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

// export const searchMany = async (
//   filter: FilterQuery<IChirp>,
//   select: string,
//   populate: PopulateOptions[],
//   sort: { [key: string]: SortValues | { $meta: 'textScore' } },
//   skip: number,
//   limit: number
// ) => {
//   const foundChirps = await Chirp.find(filter)
//     .select(select)
//     .select({ score: { $meta: 'textScore' } }) // delete score later
//     .populate(populate)
//     .sort(sort)
//     .skip(skip)
//     .limit(limit);
//   return foundChirps;
// };

// export const getUserTimeline = async (
//   filter: FilterQuery<IChirp>,
//   select: string,
//   populate: PopulateOptions[],
//   limit: number
// ) => {
//   const timelineChirps = await Chirp.find(filter)
//     .select(select)
//     .populate(populate)
//     .sort({ _id: -1 })
//     .limit(limit);
//   return timelineChirps;
// };

// export const findManyByUser = async (
//   filter: FilterQuery<IChirp>,
//   select: string,
//   populate: PopulateOptions[],
//   limit: number
// ) => {
//   const foundUsersChirps = await Chirp.find(filter)
//     .select(select)
//     .populate(populate)
//     .sort({ _id: -1 })
//     .limit(limit);
//   return foundUsersChirps;
// };

const createReply = async (
  content: string,
  author: Types.ObjectId,
  parentId: Types.ObjectId
) => {
  // const parentChirp = await Chirp.findById(parentId);
  // if (!parentChirp) {
  //   throw new Error('Sorry, we could not find chirp you are replying to');
  // }
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
  // const chirp = await Chirp.findById(id);
  // if (!chirp) {
  //   // res.status(400);
  //   throw new Error('Sorry, we could not find that chirp');
  // }

  const chirp = await findOne(id);
  await chirp.remove();
};

// export const findManyLiked = async (
//   filter: FilterQuery<IChirp>, // user, chirpFields, userFields, limit, sinceId?
//   populate: PopulateOptions[],
//   limit: number
// ) => {
//   const likes = await Like.find(filter)
//     .populate<PopulatedChirp>(populate)
//     .sort({ _id: -1 })
//     .limit(limit);
//   return likes.map((like) => like.chirp);
// };

// interface PopulatedChirp {
//   chirp: IChirp;
// }
