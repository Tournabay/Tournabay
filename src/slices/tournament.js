import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tournament: {
    id: null,
    name: null,
    createdAt: null,
    updatedAt: null,
    startDate: null,
    endDate: null,
    gameMode: null,
    scoreType: null,
    teamFormat: null,
    roles: [],
    staffMembers: [],
    permission: null,
    participants: [],
    owner: null,
  },
};

const slice = createSlice({
  name: "tournament",
  initialState,
  reducers: {
    setTournament: (state, action) => {
      state.tournament = action.payload;
    },
    addStaffMember(state, action) {
      state.tournament.staffMembers = [...state.tournament.staffMembers, action.payload];
    },
    removeStaffMember(state, action) {
      state.tournament.staffMembers = state.tournament.staffMembers.filter(
        (member) => member.id !== action.payload
      );
    },
    replaceStaffMember(state, action) {
      state.tournament.staffMembers = state.tournament.staffMembers.filter(
        (member) => member.id !== action.payload.id
      );
      state.tournament.staffMembers = [...state.tournament.staffMembers, action.payload];
    },
    addRole(state, action) {
      state.tournament.roles = [...state.tournament.roles, action.payload];
    },
    removeRole(state, action) {
      state.tournament.roles = state.tournament.roles.filter(
        (role) => role.id !== action.payload.id
      );
    },
    replaceRole(state, action) {
      const roleIndex = state.tournament.roles.findIndex((role) => role.id === action.payload.id);
      state.tournament.roles[roleIndex] = action.payload;
    },
    changeRolesPosition: (state, action) => {
      const role1 = { ...state.tournament.roles[action.payload.role1Index] };
      const role2 = { ...state.tournament.roles[action.payload.role2Index] };
      const role1Position = role1.position;
      role1.position = role2.position;
      role2.position = role1Position;
      state.tournament.roles[action.payload.role1Index] = role2;
      state.tournament.roles[action.payload.role2Index] = role1;
    },
    updatePermission(state, action) {
      state.tournament.permission = action.payload;
    },
  },
});

export const { reducer } = slice;
export const getUser = (state) => state;

// actions

export const setTournament = (tournament) => async (dispatch) => {
  dispatch(slice.actions.setTournament(tournament));
};

export const addStaffMember = (staffMember) => async (dispatch) => {
  dispatch(slice.actions.addStaffMember(staffMember));
};

export const removeStaffMember = (staffMember) => async (dispatch) => {
  dispatch(slice.actions.removeStaffMember(staffMember));
};

export const updateStaffMember = (staffMember) => async (dispatch) => {
  dispatch(slice.actions.replaceStaffMember(staffMember));
};

export const addRole = (role) => async (dispatch) => {
  dispatch(slice.actions.addRole(role));
};

export const removeRole = (role) => async (dispatch) => {
  dispatch(slice.actions.removeRole(role));
};

export const updateRole = (role) => async (dispatch) => {
  dispatch(slice.actions.replaceRole(role));
};

export const replaceRolesPosition = (role1Index, role2Index) => async (dispatch) => {
  dispatch(slice.actions.changeRolesPosition({ role1Index, role2Index }));
};

export const updatePermission = (permission) => async (dispatch) => {
  dispatch(slice.actions.updatePermission(permission));
};

export default slice;
