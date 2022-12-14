import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton, Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { useState } from "react";
import { useDispatch } from "react-redux";
import useTournament from "../../../../hooks/useTournament";
import TournamentTeamsAutocomplete from "../../../team-autocomplete";
import { groupApi } from "../../../../api/groupApi";
import { removeMatch, updateGroup } from '../../../../slices/tournament';
import toast from "react-hot-toast";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { notifyOnError } from "../../../../utils/error-response";
import Scrollbar from "../../../scrollbar";
import { getInitials } from '../../../../utils/get-initials';
import { matchApi } from '../../../../api/matchApi';

const EditGroupDialog = (props) => {
  const { group, closeModal } = props;
  const { tournament } = useTournament();
  const [autocompleteValue, setAutocompleteValue] = useState(null);
  const [requestLoading, setRequestLoading] = useState(false);
  const dispatch = useDispatch();

  const handleTeamChange = (event, value) => {
    groupApi
      .assignTeamToGroup(group.id, tournament.id, value.id)
      .then((response) => {
        dispatch(updateGroup(response.data));
        toast.success("Team added to group successfully");
        setAutocompleteValue(null);
      })
      .catch((error) => notifyOnError(error));
  };

  const handleTeamDelete = (teamId) => {
    groupApi
      .removeTeamFromGroup(group.id, tournament.id, teamId)
      .then((response) => {
        dispatch(updateGroup(response.data));
        toast.success("Team removed from group successfully");
      })
      .catch((error) => notifyOnError(error));
  };

  const handleMatchDelete = (matchId) => {
    const toastLoadingId = toast.loading("Deleting match");
    setRequestLoading(true);
    matchApi
      .deleteMatch(matchId, tournament.id)
      .then((response) => {
        dispatch(removeMatch(response.data.id));
        toast.success("Match deleted successfully!");
      })
      .catch((error) => {
        notifyOnError(error);
      })
      .finally(() => {
        setRequestLoading(false);
        toast.remove(toastLoadingId);
      });
  };

  const teams = () => (
    <Box>
      <Box>
        <TournamentTeamsAutocomplete
          tournament={tournament}
          value={autocompleteValue}
          handleTeamChange={handleTeamChange}
          multiple={false}
        />
      </Box>
      <Box>
        <Scrollbar>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Team name</TableCell>
                  <TableCell>Wins</TableCell>
                  <TableCell>Losses</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {group.teams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell>{team.team?.name}</TableCell>
                    <TableCell>{team.wins}</TableCell>
                    <TableCell>{team.losses}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        sx={{ mx: 0.5 }}
                        color="error"
                        onClick={() => handleTeamDelete(team.team?.id)}
                      >
                        <DeleteForeverIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Box>
    </Box>
  );

  const participants = () => (
    <Box>
      <h5>Players</h5>
      {group.participants.map((participant) => (
        <div key={participant.id}>{participant.user.username}</div>
      ))}
    </Box>
  );

  const matches = () => {
    if (tournament.teamFormat === "TEAM_VS") {
      return (
        <Box>
          <Scrollbar>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Red</TableCell>
                    <TableCell></TableCell>
                    <TableCell>Blue</TableCell>
                    <TableCell>Start</TableCell>
                    <TableCell>Referees</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {group.matches.map((match) => (
                    <TableRow key={match.id}>
                      <TableCell>{match.redTeam.name}</TableCell>
                      <TableCell>
                        {match.matchResult
                          ? `${match.matchResult.redScore} : ${match.matchResult.blueScore}`
                          : "vs."}
                      </TableCell>
                      <TableCell>{match.blueTeam.name}</TableCell>
                      <TableCell>
                        {match.startDate} {match.startTime.substring(0, 5)}
                      </TableCell>
                      <TableCell>
                        {match.referees.map((referee) => (
                          <Box
                            key={referee.id}
                            sx={{ display: "flex", alignItems: "center", mb: 1 }}
                          >
                            <Avatar
                              src={referee.user.avatarUrl}
                              sx={{
                                height: 20,
                                width: 20,
                                mr: 1,
                              }}
                            >
                              {getInitials(referee.user.username)}
                            </Avatar>
                            <Link href={`https://osu.ppy.sh/users/${referee.user.osuId}`} target="_blank">
                              {referee.user.username}
                            </Link>
                          </Box>
                        ))}
                      </TableCell>
                      <TableCell align="right">
                        {!match.isCompleted && (
                          <Box>
                            <IconButton
                              disabled
                              sx={{ mx: 0.5 }}
                              color="success"
                            >
                              <AssessmentIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              sx={{ mx: 0.5 }}
                              color="error"
                              onClick={() => handleMatchDelete(match.id)}
                            >
                              <DeleteForeverIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Box>
      );
    }
  };

  return (
    <form>
      <Box sx={{ p: 2 }}>
        <h3>Group {group.symbol}</h3>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>{tournament.teamFormat === "TEAM_VS" ? teams() : participants()}</Box>
      <Box sx={{ p: 2 }}>{matches()}</Box>
    </form>
  );
};

EditGroupDialog.propTypes = {
  group: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default EditGroupDialog;
