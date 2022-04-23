import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Dialog,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import AddIcon from "@mui/icons-material/Add";
import Scrollbar from "../../../scrollbar";
import { SeverityPill } from "../../../severity-pill";
import AddStaffMemberForm from "./AddStaffMemberForm";
import { useState } from "react";
import NextLink from "next/link";
import { getInitials } from "../../../../utils/get-initials";
import { staffMemberApi } from "../../../../api/staffMemberApi";
import toast from "react-hot-toast";
import { useDispatch } from "../../../../store";
import { removeStaffMember } from "../../../../slices/tournament";
import useTournament from "../../../../hooks/useTournament";
import EditStaffMember from "./EditStaffMember";

const ParticipantsTable = (props) => {
  const { participants } = props;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleAddStaffMemberClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <Card>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <CardHeader title="Staff members" />
          <Button
            color="primary"
            sx={{ m: 2 }}
            startIcon={<AddIcon />}
            variant="contained"
            onClick={handleAddStaffMemberClick}
          >
            Add staff member
          </Button>
        </Box>
        <Scrollbar>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Discord</TableCell>
                  <TableCell>Roles</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Joined At</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {participants.map((participant) => (
                  <StaffRow key={participant.id} participant={participant} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>
      <Dialog fullWidth maxWidth="sm" onClose={handleDialogClose} open={isDialogOpen}>
        {/* Dialog renders its body even if not open */}
        {isDialogOpen && <AddStaffMemberForm closeModal={handleDialogClose} />}
      </Dialog>
    </>
  );
};

const ParticipantRow = (props) => {
  const { participant } = props;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { tournament } = useTournament();

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDeleteClick = () => {
    setIsLoading(true);
    const toastLoadingId = toast.loading("Removing staff member.");
    staffMemberApi
      .removeStaffMember(participant.id, tournament.id)
      .then((response) => {
        dispatch(removeStaffMember(participant.id));
        toast.success(`${participant.user.username} removed!`);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        toast.remove(toastLoadingId);
        setIsLoading(false);
      });
  };

  return (
    <TableRow hover>
      <TableCell>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
          }}
        >
          <Avatar
            src={`https://a.ppy.sh/${participant.user.osuId}`}
            sx={{
              height: 42,
              width: 42,
            }}
          >
            {getInitials(participant.user.username)}
          </Avatar>
          <Box sx={{ ml: 1 }}>
            {participant.user.username}
            <Typography color="textSecondary" variant="body2">
              {participant.user.osuId}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>{participant.discordId}</TableCell>
      <TableCell>
        {participant.tournamentRoles.map((role) => (
          <SeverityPill key={role.id}>{role.name}</SeverityPill>
        ))}
      </TableCell>
      <TableCell>
        <SeverityPill>{participant.status}</SeverityPill>
      </TableCell>
      <TableCell>{participant.joinedAt}</TableCell>
      <TableCell align="right">
        <Button sx={{ m: 1 }} variant="outlined" disabled={isLoading} onClick={handleDialogOpen}>
          Edit
        </Button>
        <Button
          sx={{ m: 1 }}
          color="error"
          variant="outlined"
          onClick={handleDeleteClick}
          disabled={isLoading}
        >
          Delete
        </Button>
      </TableCell>
      <Dialog fullWidth maxWidth="sm" onClose={handleDialogClose} open={isDialogOpen}>
        {/* Dialog renders its body even if not open */}
        {isDialogOpen && (
          <EditStaffMember staffMember={participant} closeModal={handleDialogClose} />
        )}
      </Dialog>
    </TableRow>
  );
};

//TODO: Add TournamentRoleGuard

ParticipantsTable.propTypes = {
  participants: PropTypes.array.isRequired,
};

ParticipantRow.propTypes = {
  participant: PropTypes.object.isRequired,
};

export default StaffTable;