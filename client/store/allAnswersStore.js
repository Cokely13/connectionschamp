import Axios from "axios";

const SET_ANSWERS ="SET_ANSWERS"
const CREATE_ANSWER = "CREATE_ANSWER"
const DELETE_ANSWER = "DELETE_ANSWER"


export const setAnswers = (answer) =>{
  return{
    type: SET_ANSWERS,
    answer
  }
};

const _createAnswer = (answer) => {
  return {
    type: CREATE_ANSWER,
    answer,
  };
};

const _deleteAnswer = (answer) => {
  return {
    type: DELETE_ANSWER,
    answer
  };
};

export const fetchAnswers = () => {
  return async (dispatch) => {
        const {data}= await Axios.get("/api/answers");
        dispatch(setAnswers(data));
  };
};

export const createAnswer = (answer) => {
  return async (dispatch) => {
    const { data: created } = await Axios.post("/api/answers", answer);
    dispatch(_createAnswer(created));
    // history.push("/answers");
  };
};

export const deleteAnswer = (id, history) => {
  return async (dispatch) => {
    const { data: answer } = await Axios.delete(`/api/answers/${id}`);
    dispatch(_deleteAnswer(answer));
    history.push("/answers");
  };
};


const initialState = [];
export default function answersReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ANSWERS:
      return action.answer;
      case CREATE_ANSWER:
        return [...state, action.answer];
        case DELETE_ANSWER:
      return state.filter((answer) => answer.id !== action.answer.id)
      ;
      default:
        return state;
    }
  }
