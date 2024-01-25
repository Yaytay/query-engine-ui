import { useEffect, useState } from 'react';
import './App.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LastPageIcon from '@mui/icons-material/LastPage';

import { components } from "./Query-Engine-Schema";
import TableFooter from '@mui/material/TableFooter';

interface HistoryProps {
  baseUrl: string
}

function History(props: HistoryProps) {

  const [history, setHistory] = useState(null as components["schemas"]["AuditHistory"] | null)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [firstRow, setFirstRow] = useState(0)
  const [sortDesc, setSortDesc] = useState(true)
  const [sortField, setSortField] = useState('timestamp')

  interface HeadCell {
    id: keyof components["schemas"]["AuditHistoryRow"];
    label: string;
    sortable: boolean;
  }

  const headCells: readonly HeadCell[] = [
    { id: 'timestamp', label: 'Timestamp', sortable: true }
    , { id: 'id', label: 'ID', sortable: true }
    , { id: 'path', label: 'Path', sortable: true }
    , { id: 'arguments', label: 'Arguments', sortable: false }
    , { id: 'host', label: 'Host', sortable: true }
    , { id: 'name', label: 'Name', sortable: true }
    , { id: 'responseCode', label: 'Response', sortable: true }
    , { id: 'responseRows', label: 'Rows', sortable: true }
    , { id: 'responseSize', label: 'Bytes', sortable: true }
    , { id: 'responseStreamStart', label: 'TTFB', sortable: true }
    , { id: 'responseDuration', label: 'Time', sortable: true }
  ]  

  useEffect(() => {
    let url = new URL(props.baseUrl + 'api/history?skipRows=' + firstRow + '&maxRows=' + rowsPerPage + '&sort=' + sortField + '&desc=' + sortDesc);
    fetch(url, { credentials: 'include' })
      .then((r: Response) => {
        if (!r.ok) {
          return r.text().then(t => {
            throw Error(t)
          })
        } else {
          return r.json()
        }
      })
      .then(j => {
        setHistory(j);
      })
  }, [props.baseUrl, rowsPerPage, firstRow, sortDesc, sortField])

  return (
    <div className='p-8'>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {headCells.map((hc) => (
                <TableCell>
                  {hc.sortable ? (
                  <TableSortLabel
                    active={sortField === hc.id}
                    direction={sortDesc ? 'desc' : 'asc'}
                    onClick={() => {
                      if (sortField === hc.id) {
                        setSortDesc(!sortDesc)
                      } else {
                        setSortField(hc.id)
                      }
                    }}
                  >
                    {hc.label}
                  </TableSortLabel>
                  ) 
                  :
                  (hc.label)
                  }
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {history &&
            <TableBody>
              {history.rows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="left">{row.timestamp.replace('T', ' ')}</TableCell>
                  <TableCell align="left">{row.id}</TableCell>
                  <TableCell align="left">{row.path}</TableCell>
                  <TableCell align="left">{JSON.stringify(row.arguments)}</TableCell>
                  <TableCell align="left">{row.host}</TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="right">{row.responseCode}</TableCell>
                  <TableCell align="right">{row.responseRows}</TableCell>
                  <TableCell align="right">{row.responseSize}</TableCell>
                  <TableCell align="right">{row.responseStreamStart}</TableCell>
                  <TableCell align="right">{row.responseDuration}</TableCell>
                </TableRow>
              ))}
              <TableRow></TableRow>
            </TableBody>
          }
          {history &&
            <TableFooter>
              <TableRow>
                <TableCell align="right" colSpan={11} className='align-middle'>
                  <div className='text-sm inline-block relative top-0.5'>
                    Rows per page:
                    <select
                      className=''
                      aria-placeholder='Rows per page'
                      defaultValue={rowsPerPage}
                      onChange={e => { setRowsPerPage(Number(e.target.value)) }}
                    >
                      <option>3</option>
                      <option>10</option>
                      <option>25</option>
                      <option>50</option>
                      <option>100</option>
                    </select>
                    &nbsp;
                    &nbsp;
                    Rows:
                    &nbsp;
                    {history.firstRow + 1}
                    &nbsp;-&nbsp;
                    {Math.min(history.firstRow + rowsPerPage, history.totalRows)}
                    &nbsp;
                    of
                    &nbsp;
                    {history.totalRows}
                    &nbsp;
                    &nbsp;
                  </div>
                  <div className='text-sm inline-block relative'>
                    <IconButton disabled={firstRow == 0} onClick={_ => { setFirstRow(0) }}>
                      <FirstPageIcon />
                    </IconButton>
                    <IconButton disabled={firstRow == 0} onClick={_ => { setFirstRow(firstRow - rowsPerPage) }}>
                      <NavigateBeforeIcon />
                    </IconButton>
                    <IconButton disabled={firstRow + rowsPerPage > history.totalRows} onClick={_ => { setFirstRow(firstRow + rowsPerPage) }}>
                      <NavigateNextIcon />
                    </IconButton>
                    <IconButton disabled={firstRow + rowsPerPage > history.totalRows} onClick={_ => { setFirstRow(rowsPerPage * Math.floor(history.totalRows / rowsPerPage)) }}>
                      <LastPageIcon />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          }
        </Table>
      </TableContainer>
    </div>
  );
}

export default History;