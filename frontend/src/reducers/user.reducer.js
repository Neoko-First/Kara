import { GET_USER, UPLOAD_PICTURES } from "../actions/user.action";

const initialState = {};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER:
      return action.payload;
    case UPLOAD_PICTURES:
      return {
        ...state,
        picture: action.payload,
      };
    default:
      return state;
  }
}
