import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
interface Props {
  arr: string[];
  size: "small" | "medium";
  className?: string;
}
const useStyles = makeStyles({
  chips: {
    display: "flex",
  },
  chip: {
    margin: 2,
  },
});
export function Chips(props: Props): JSX.Element {
  const classes = useStyles();
  return (
    <div className={classes.chips + " " + props.className}>
      {props.arr.map((v) => (
        <Chip size={props.size} className={classes.chip} key={v} label={v} />
      ))}
    </div>
  );
}
