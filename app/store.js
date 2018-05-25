import { createStore } from "redux";

import reducer from "./reducers/reducer";

let window = window ? window : global.window;

let store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;