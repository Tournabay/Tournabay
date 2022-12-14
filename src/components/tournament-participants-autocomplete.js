import * as React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import Autocomplete from "@mui/material/Autocomplete";
import AddParticipantForm from "./dashboard/tournament/participants/AddParticipantForm";
import { Avatar } from "@mui/material";
import { getInitials } from "../utils/get-initials";
import PropTypes from "prop-types";
import { useState } from "react";

const TournamentParticipantsAutocomplete = (props) => {
  const { tournament, label, value, handleParticipantChange } = props;
  const [open, toggleOpen] = useState(false);

  const handleClose = () => {
    toggleOpen(false);
  };

  return (
    <React.Fragment>
      <Autocomplete
        multiple
        value={value}
        onChange={(event, newValue) => {
          const doesParticipantExist = newValue.some((user) => {
            return user.user.username === "Add new participant";
          });
          if (doesParticipantExist) {
            setTimeout(() => {
              toggleOpen(true);
            });
          } else {
            handleParticipantChange(event, newValue);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = options.filter((option) => {
            return (
              option.user.username.toLowerCase().includes(params.inputValue.toLowerCase()) ||
              option.user.osuId.toString().includes(params.inputValue)
            );
          });

          if (filtered.length === 0 && params.inputValue !== "") {
            filtered.push({
              user: {
                username: "Add new participant",
                avatarUrl: "https://a.ppy.sh/-1",
                osuId: 0,
              },
            });
          }

          return filtered;
        }}
        id="participants-autocomplete"
        options={tournament.participants}
        getOptionLabel={(option) => {
          return option.user.username;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(props, option) => (
          <li {...props}>
            <Avatar
              sx={{ mr: 1 }}
              alt={getInitials(option.user.avatarUrl)}
              src={option.user.avatarUrl}
            />
            {option.user.username}
          </li>
        )}
        sx={{ mt: 1 }}
        freeSolo
        renderInput={(params) => <TextField {...params} label={label} />}
      />
      <Dialog fullWidth maxWidth="sm" onClose={handleClose} open={open}>
        {open && (
          <AddParticipantForm closeModal={handleClose} toastLabelLoading="Adding participant" />
        )}
      </Dialog>
    </React.Fragment>
  );
};

TournamentParticipantsAutocomplete.propTypes = {
  tournament: PropTypes.object.isRequired,
  label: PropTypes.object.isRequired,
  value: PropTypes.array.isRequired,
  handleParticipantChange: PropTypes.func.isRequired,
};

export default TournamentParticipantsAutocomplete;
