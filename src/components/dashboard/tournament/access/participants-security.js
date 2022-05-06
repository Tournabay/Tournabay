import { Box, Button } from "@mui/material";
import useTournament from "../../../../hooks/useTournament";
import TournamentRolesAutocomplete from "../../../roles-autocomplete";
import TournamentStaffMembersAutocomplete from "../../../staff-autocomplete";
import { useState } from "react";
import { tournamentPermissionApi } from "../../../../api/tournamentPermissionApi";
import toast from "react-hot-toast";
import { useDispatch } from "../../../../store";
import { updatePermission } from "../../../../slices/tournament";

const ParticipantsSecurity = () => {
  const { tournament } = useTournament();
  const [rolesValue, setRolesValue] = useState(
    tournament.permission.canTournamentRoleManageParticipants
  );
  const [staffMembersValue, setStaffMembersValue] = useState(
    tournament.permission.canStaffMemberManageParticipants
  );
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleRolesChange = (event, value) => {
    setRolesValue(value);
  };

  const handleStaffMemberChange = (event, value) => {
    setStaffMembersValue(value);
  };

  const handleSaveClick = () => {
    setIsLoading(true);
    const toastLoadingId = toast.loading("Updating participants permissions.");
    tournamentPermissionApi
      .updateParticipantsPermission(tournament.id, {
        tournamentRoles: rolesValue,
        staffMembers: staffMembersValue,
      })
      .then((response) => {
        dispatch(updatePermission(response.data));
        toast.success("Participants permissions updated successfully.");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
        toast.remove(toastLoadingId);
      });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <h3>Participants</h3>
      <p>Can enter the participants page and manage them:</p>
      <Box>
        <TournamentRolesAutocomplete
          tournament={tournament}
          value={rolesValue}
          handleRolesChange={handleRolesChange}
          multiple={true}
        />
        <TournamentStaffMembersAutocomplete
          tournament={tournament}
          value={staffMembersValue}
          handleStaffChange={handleStaffMemberChange}
          multiple={true}
        />
      </Box>
      <Button
        color="primary"
        sx={{ mt: 1, alignSelf: "flex-end" }}
        type="submit"
        variant="contained"
        disabled={isLoading}
        onClick={handleSaveClick}
      >
        Save
      </Button>
    </Box>
  );
};

export default ParticipantsSecurity;
