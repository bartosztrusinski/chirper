import axios from 'axios';

const SERVER_ERROR_MESSAGE = 'Server error. Please try again later.';

const getRequestErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error) && error?.response?.data?.message) {
    return error.response.data.message;
  }
  return SERVER_ERROR_MESSAGE;
};

export default getRequestErrorMessage;
