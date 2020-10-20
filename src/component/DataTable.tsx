import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { matchSorter } from "match-sorter";

interface FilterFunc {
  (value: any): boolean;
}
interface Column {
  id: string;
  name: string;
}
interface Filter {
  id: string;
  filter?: "include" | "equal" | "between" | "fuzzyText" | FilterFunc;
}
interface Data {
  _id: string;
  [propName: string]: any;
}
interface Render {
  (value: any, colID: string): JSX.Element;
}
interface Props {
  data: Data[];
  columns: Column[];
  filter?: Filter[];
  filterState: Record<string, any>;
  render: Render;
}
function betweenFilter(max: number, min: number, value: number): boolean {
  return value <= max && value >= min;
}
function includeFilter<T>(arr: T[], value: T): boolean {
  return arr.includes(value);
}
function equalFilter<T>(state: T, value: T): boolean {
  return state == value;
}
function fuzzyTextFilter(state: string, value: string): boolean {
  return matchSorter([value], state).length != 0;
}
export function DataTable(props: Props): JSX.Element {
  const afterFilter = props.data.filter((v) => {
    const firstNotMatchColumn = props.filter.findIndex((f) => {
      if (typeof f.filter == "string") {
        switch (f.filter) {
          case "include":
            return !includeFilter(props.filterState[f.id], v[f.id]);
          case "equal":
            return !equalFilter(props.filterState[f.id], v[f.id]);
          case "between":
            return !betweenFilter(
              props.filterState[f.id].max,
              props.filterState[f.id].min,
              v[f.id]
            );
          case "fuzzyText":
            return !fuzzyTextFilter(props.filterState[f.id], v[f.id]);
          default:
            console.warn(`unExcepted filter ${f.filter}`);
            return true;
        }
      } else if (!f.filter) {
        return fuzzyTextFilter(props.filterState[f.id], v[f.id]);
      } else {
        return !f.filter(v[f.id]);
      }
    });
    return firstNotMatchColumn == -1;
  });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
        count={afterFilter.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {props.columns.map((v) => (
                <TableCell key={v.id}>{v.name}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {afterFilter
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
        count={afterFilter.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
}
