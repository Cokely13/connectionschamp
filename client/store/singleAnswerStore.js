import axios from "axios";

// Action Types
const SET_SINGLE_ANSWER = "SET_SINGLE_ANSWER";
const UPDATE_SINGLE_ANSWER = "UPDATE_SINGLE_ANSWER";
const TOKEN = "token";

// Action creators
export const _setSingleAnswer= (answerdata) => {
  return {
    type: SET_SINGLE_ANSWER,
    answerdata,
  };
};

const _updateSingleAnswer = (answerdata) => {
  return {
    type: UPDATE_SINGLE_ANSWER,
    answerdata,
  };
};

//Thunks
export const fetchAnswer = (id) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/answers/${id}`);
    dispatch(_setSingleAnswer(data));
  };
};

// export const updateSingleAnswer = (answer) => {
//   return async (dispatch) => {
//     try {
//         await axios.put(`/api/answers/${answer.id}`, answer);
//         const { data: answerData } = await axios.get(`/api/answers/${answer.id}`);
//         dispatch(_updateSingleAnswer(answerData));
//         history.push(`/answers/${answer.id}`)
//       }
//      catch (error) {
//       console.log("ANSWER", answer)
//     }
//   };
// };

export const updateSingleAnswer = (formData) => {
  return async (dispatch) => {
    try {
      // Make sure to pass the formData directly to axios.put
      await axios.put(`/api/answers/${formData.get('id')}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Fetch the updated answer data
      const { data: answerData } = await axios.get(`/api/answers/${formData.get('id')}`);
      dispatch(_updateSingleAnswer(answerData));
    } catch (error) {
      console.error('Failed to update answer:', error);
    }
  };
};


// reducer
const initialState = [];
const singleAnswerReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SINGLE_ANSWER:
      return action.answerdata;
    case UPDATE_SINGLE_ANSWER:
      return action.answerdata;
    default:
      return state;
  }
};

export default singleAnswerReducer;
