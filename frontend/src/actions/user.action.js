import axios from "axios";

export const GET_USER = "GET_USER";
export const UPLOAD_PICTURES = "UPLOAD_PICTURES";

export const getUser = (uid) => {
  return (dispatch) => {
    return axios
      .get(`http://localhost:5000/api/user/${uid}`)
      .then((res) => {
        dispatch({ type: GET_USER, payload: res.data });
      })
      .catch((err) => console.log(err));
  };
};

export const uploadPictures = (data, id) => {
  return (dispatch) => {
    return axios
      .post(`http://localhost:5000/api/user/upload`, data)
      .then((res) => {
        return axios.get(`http://localhost:5000/api/user/${id}`).then((res) => {
          dispatch({ type: UPLOAD_PICTURES, payload: res.data.pictures });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
