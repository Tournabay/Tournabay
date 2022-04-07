import { createSlice } from "@reduxjs/toolkit";
import { apolloClient } from "../apollo/apolloClient";
import { createTournamentMutation } from "../ql/TournamentMutations";
import { setTournament } from "./tournament";

const initialState = {
  tournament: {
    name: "",
    scoreType: "SCORE_V2",
    gameMode: "STANDARD",
    teamFormat: "PLAYER_VS",
    startDate: new Date(),
    endDate: new Date(),
  },
};

const slice = createSlice({
  name: "tournamentWizard",
  initialState,
  reducers: {
    reset(state, action) {
      state.tournament = action.payload.tournament;
    },
    setTournamentId(state, action) {
      state.tournament.id = action.payload;
    },
    setScoreType(state, action) {
      state.tournament.scoreType = action.payload;
    },
    setGameMode(state, action) {
      state.tournament.gameMode = action.payload;
    },
    setName(state, action) {
      state.tournament.name = action.payload;
    },
    setTournamentStartDate(state, action) {
      state.tournament.startDate = action.payload;
    },
    setTournamentEndDate(state, action) {
      state.tournament.endDate = action.payload;
    },
    setTournamentTeamFormat(state, action) {
      state.tournament.teamFormat = action.payload;
    },
  },
});

export const { reducer } = slice;

// actions

export const resetWizard = () => async (dispatch) => {
  dispatch(slice.actions.reset(initialState));
};

export const setTournamentId = (id) => async (dispatch) => {
  dispatch(slice.actions.setTournamentId(id));
};

export const setTournamentScoreType = (scoreType) => async (dispatch) => {
  dispatch(slice.actions.setScoreType(scoreType));
};

export const setTournamentName = (name) => async (dispatch) => {
  dispatch(slice.actions.setName(name));
};

export const setTournamentGameMode = (gameMode) => async (dispatch) => {
  dispatch(slice.actions.setGameMode(gameMode));
};

export const setTournamentStartDate = (startDate) => async (dispatch) => {
  dispatch(slice.actions.setTournamentStartDate(startDate));
};

export const setTournamentEndDate = (endDate) => async (dispatch) => {
  dispatch(slice.actions.setTournamentEndDate(endDate));
};

export const setTournamentTeamFormat = (teamFormat) => async (dispatch) => {
  dispatch(slice.actions.setTournamentTeamFormat(teamFormat));
};

export const createTournament = (tournamentData) => async (dispatch) => {
  return apolloClient
    .mutate({
      mutation: createTournamentMutation,
      variables: {
        input: tournamentData,
      },
    })
    .then((response) => {
      dispatch(setTournament(response.data.createTournament));
      dispatch(resetWizard());
    });
};

export default slice;
