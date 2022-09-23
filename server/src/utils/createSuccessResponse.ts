import SuccessResponse from '../types/SuccessResponse';

const createSuccessResponse = (
  data: SuccessResponse['data'],
  meta?: SuccessResponse['meta']
) => {
  const response: SuccessResponse = { data };

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

export default createSuccessResponse;