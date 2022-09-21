import { ResponseData, ResponseMeta, ResponseBody } from '../schemas';

const createResponse = (data: ResponseData, meta?: ResponseMeta) => {
  const response: ResponseBody = { data };

  if (!meta) {
    return response;
  }

  Object.keys(meta).forEach(
    (key) => meta[key] === undefined && delete meta[key]
  );
  if (Object.keys(meta).length) {
    response.meta = meta;
  }

  return response;
};

export default createResponse;
