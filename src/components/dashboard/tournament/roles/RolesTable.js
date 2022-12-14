import {
  Box,
  Button,
  Card,
  CardHeader,
  Dialog,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import PropTypes from "prop-types";
import AddIcon from "@mui/icons-material/Add";
import Scrollbar from "../../../scrollbar";
import { SeverityPill } from "../../../severity-pill";
import { useState } from "react";
import AddRoleForm from "./AddRoleForm";
import { tournamentRoleApi } from "../../../../api/tournamentRoleApi";
import toast from "react-hot-toast";
import { useDispatch } from "../../../../store";
import { removeRole, replaceRolesPosition } from "../../../../slices/tournament";
import EditRole from "./EditRole";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SaveIcon from "@mui/icons-material/Save";

const RolesTable = (props) => {
  const { roles, tournament } = props;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPositionSaving, setIsPositionSaving] = useState(false);
  const dispatch = useDispatch();

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const moveRoleUpwards = (roleIndex) => {
    if (roleIndex === 0) return;
    dispatch(replaceRolesPosition(roleIndex, roleIndex - 1));
  };

  const moveRoleDownwards = (roleIndex) => {
    if (roleIndex === roles.length - 1) return;
    dispatch(replaceRolesPosition(roleIndex, roleIndex + 1));
  };

  const handleSaveRolesPosition = () => {
    setIsPositionSaving(true);
    const toastLoadingId = toast.loading("Changing roles position.");
    tournamentRoleApi
      .saveRolesPosition(tournament.id, roles)
      .then(() => toast.success("Roles position saved!"))
      .catch(() => toast.error("Error saving roles position."))
      .finally(() => {
        setIsPositionSaving(false);
        toast.remove(toastLoadingId);
      });
  };

  const tournamentRoles = [...roles];
  const sortedRolesByPosition = tournamentRoles.sort((a, b) => a.position - b.position);

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
          <CardHeader title="Tournament roles" />
          <Box>
            <Button
              color="primary"
              sx={{ m: 1 }}
              startIcon={<SaveIcon />}
              variant="outlined"
              disabled={isPositionSaving}
              onClick={handleSaveRolesPosition}
            >
              Save positions
            </Button>
            <Button
              color="primary"
              sx={{ m: 2 }}
              startIcon={<AddIcon />}
              variant="contained"
              onClick={handleDialogOpen}
            >
              New Role
            </Button>
          </Box>
        </Box>
        <Scrollbar>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Role name</TableCell>
                  <TableCell>Hidden</TableCell>
                  <TableCell>Protected</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedRolesByPosition.map((role, index) => (
                  <RoleRow
                    key={role.id}
                    index={index}
                    role={role}
                    tournament={tournament}
                    moveRoleUpwards={moveRoleUpwards}
                    moveRoleDownwards={moveRoleDownwards}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>
      <Dialog fullWidth maxWidth="sm" onClose={handleDialogClose} open={isDialogOpen}>
        {/* Dialog renders its body even if not open */}
        {isDialogOpen && <AddRoleForm roles={roles} closeModal={handleDialogClose} />}
      </Dialog>
    </>
  );
};

const RoleRow = (props) => {
  const { role, tournament, index, moveRoleUpwards, moveRoleDownwards } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dispatch = useDispatch();

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDeleteButton = () => {
    if (role.isProtected) {
      toast.error("Cannot delete a protected role");
      return;
    }
    setIsLoading(true);
    const toastLoadingId = toast.loading("Removing role.");
    tournamentRoleApi
      .removeRole(role.id, tournament.id)
      .then(() => {
        toast.success(`${role.name} deleted!`);
        dispatch(removeRole(role));
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
    <TableRow hover>
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ mx: 1, display: "flex", alignItems: "center" }}>
            {index !== 0 && (
              <IconButton aria-label="move up" onClick={() => moveRoleUpwards(index)}>
                <ArrowUpwardIcon />
              </IconButton>
            )}
            {index !== tournament.roles.length - 1 && (
              <IconButton aria-label="move down" onClick={() => moveRoleDownwards(index)}>
                <ArrowDownwardIcon />
              </IconButton>
            )}
          </Box>
          {role.name}
        </Box>
      </TableCell>
      <TableCell>{role.isHidden && <SeverityPill color="primary">Hidden</SeverityPill>}</TableCell>
      <TableCell>
        {role.isProtected && <SeverityPill color="success">Protected</SeverityPill>}
      </TableCell>
      <TableCell align="right">
        <Button sx={{ mx: 1 }} variant="outlined" onClick={handleDialogOpen} disabled={isLoading}>
          Edit
        </Button>
        {!role.isProtected && (
          <Button
            sx={{ mx: 1 }}
            variant="outlined"
            color="error"
            onClick={handleDeleteButton}
            disabled={isLoading}
          >
            Delete
          </Button>
        )}
      </TableCell>
      <Dialog fullWidth maxWidth="sm" onClose={handleDialogClose} open={isDialogOpen}>
        {isDialogOpen && <EditRole role={role} closeModal={handleDialogClose} />}
      </Dialog>
    </TableRow>
  );
};

//TODO: Add TournamentRoleGuard

RolesTable.propTypes = {
  tournament: PropTypes.object.isRequired,
  roles: PropTypes.array.isRequired,
};

RoleRow.propTypes = {
  index: PropTypes.number.isRequired,
  role: PropTypes.object.isRequired,
  tournament: PropTypes.object.isRequired,
  moveRoleUpwards: PropTypes.func.isRequired,
  moveRoleDownwards: PropTypes.func.isRequired,
};

export default RolesTable;
