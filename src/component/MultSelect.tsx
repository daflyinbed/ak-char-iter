import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import { Chips } from "./Chips";
const useStyles = makeStyles({
  chips: {
    overflow: "hidden",
  },
  chip: {
    margin: 2,
  },
});
interface Props {
  options: string[];
  labelID: string;
  labelRender: () => React.ReactNode;
  onChange: (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
    child: React.ReactNode
  ) => void;
  selected: string[];
  className: string;
}
export function MultiSelect(props: Props): JSX.Element {
  const classes = useStyles();
  return (
    <FormControl
      className={props.className}
      onClick={(event) => event.stopPropagation()}
      onFocus={(event) => event.stopPropagation()}
    >
      <InputLabel id={props.labelID}>{props.labelRender()}</InputLabel>
      <Select
        labelId={props.labelID}
        multiple
        value={props.selected}
        onChange={props.onChange}
        input={<Input />}
        renderValue={(selected) => (
          <Chips
            className={classes.chips}
            size="small"
            arr={selected as string[]}
          />
        )}
      >
        {props.options.map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
