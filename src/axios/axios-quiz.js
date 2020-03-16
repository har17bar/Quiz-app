import axios from "axios";

export default axios.create({
  baseURL: "https://quiz-app-9a27a.firebaseio.com/"
});
