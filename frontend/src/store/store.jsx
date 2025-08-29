import { configureStore } from "@reduxjs/toolkit";

// Import your slice reducers
import authReducer from "./reducers/authReducer";
import bookReducer from "./reducers/bookReducer";
import requestReducer from "./reducers/requestReducer";

// Optional: add middleware customization or preloadedState if needed
const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    requests: requestReducer,
  },
});

export default store;
