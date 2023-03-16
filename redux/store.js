import { configureStore } from "@reduxjs/toolkit";
// import with a name you want.
import firestoreSliceReduer from "./firestoreSlice"

export default configureStore({
  reducer: {
    firestoreSlice: firestoreSliceReduer
  },
});
