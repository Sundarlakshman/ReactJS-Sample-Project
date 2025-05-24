import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  editingUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(
        (u) => u.email === action.payload.email
      );
      if (index !== -1) state.users[index] = action.payload;
    },
    setEditingUser: (state, action) => {
      state.editingUser = action.payload;
    },
  },
});

export const { addUser, updateUser, setEditingUser } = userSlice.actions;
export default userSlice.reducer;
