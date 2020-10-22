import React, { useState, useEffect, useReducer } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import { makeStyles } from "@material-ui/core/styles";
import { Filter, Data, useFilter } from "../hook/useFilter";

interface Column {
  id: string;
  name: string;
}

interface Render {
  (value: any, colID: string): JSX.Element;
}
interface Props {
  data: Data[];
  columns: Column[];
  filter: Record<string, Filter>;
  render: Render;
}

type Order = undefined | "asc" | "desc";
const useStyles = makeStyles({
  badge: {
    marginLeft: "4px",
    backgroundColor: "rgba(0,0,0,.12)",
    color: "rgba(0,0,0,.87)",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    border: 0,
    borderRadius: "50%",
    minWidth: "18px",
    minHeight: "18px",
    height: "18px",
    width: "18px",
  },
});
const OrderArr = [undefined, "asc", "desc"];
export function DataTable(props: Props): JSX.Element {
  const classes = useStyles();
  const [filterResult, setFilter] = useFilter(props.data);
  useEffect(() => {
    setFilter(props.data, props.filter);
  }, [props.data, props.filter]);
  useEffect(() => {
    setPage(0);
  }, [filterResult]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, dispatchOrder] = useReducer(
    (state: Record<string, Order | string[]>, id: string) => {
      let index = OrderArr.indexOf(state[id] as Order);
      if (index == -1) {
        index = 1;
      } else {
        index = (index + 1) % 3;
      }
      const result = { ...state };
      result[id] = OrderArr[index % 3] as Order;
      if (index == 0) {
        let _order = state._order as string[];
        _order = _order.filter((v) => v != id);
        result._order = _order;
      } else if (index == 1) {
        (result._order as string[]).push(id);
        result._order = Array.from(new Set(result._order));
      }
      return result;
    },
    { _order: [] }
  );
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={filterResult.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      <TableContainer>
        <Table size={"small"}>
          <TableHead>
            <TableRow>
              {props.columns.map((v) => {
                return (
                  <TableCell key={v.id} sortDirection={order[v.id] as Order}>
                    <TableSortLabel
                      onClick={() => {
                        dispatchOrder(v.id);
                      }}
                      active={!!order[v.id]}
                      direction={order[v.id] as Order}
                    >
                      {v.name}
                      {!!order[v.id] ? (
                        <span className={classes.badge}>
                          {(order._order as string[]).indexOf(v.id) + 1}
                        </span>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                );
                // return <TableCell key={v.id}>{v.name}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {filterResult
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((v) => (
                <TableRow key={v._id}>
                  {props.columns.map((c) => (
                    <TableCell key={`${v._id}-${c.id}`}>
                      {props.render(v[c.id], c.id)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={filterResult.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
}
