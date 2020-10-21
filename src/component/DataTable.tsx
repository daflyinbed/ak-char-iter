import React, { useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";

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

export function DataTable(props: Props): JSX.Element {
  const [filterResult, setFilter] = useFilter(props.data);
  useEffect(() => {
    setFilter(props.data, props.filter);
  }, [props.data, props.filter]);
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
  console.log(filterResult);
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
        <Table>
          <TableHead>
            <TableRow>
              {props.columns.map((v) => (
                <TableCell key={v.id}>{v.name}</TableCell>
              ))}
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
