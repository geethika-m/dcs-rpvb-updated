import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Card, Row, Col, Button } from "react-bootstrap";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import * as MdIcons from "react-icons/md";
import GlobalFilter from "./globalFilter";
import Pagination from "./pagination";
import { database, auth } from "../../firebase";
import CalenderView from "../calendarView/calendarView.js";
import CalenderIcon from "../../images/calender.svg";
import TableIcon from "../../images/table.svg";
import { useRef } from "react";
import { deleteDoc, doc } from "firebase/firestore";

/**
 * @function TableContainer
 *
 * It's a function that returns a table component for displaying datat
 * @returns The return is a rendered table.
 */

const TableContainer = ({
  type,
  columns,
  data,
  showViewColumn,
  enableCalender,
  showPendingApprovalCount,
  updateUsersList
}) => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);
  const [activeView, setActiveView] = useState("calender");
  const filteredDataRef = useRef([]);

  /* Function to get approver information */
  const getCurrentUserInfo = async () => {
    const currentUser = auth.currentUser;
    const userDB = await database.usersRef
      .where("uid", "==", currentUser.uid)
      .get();

    if (!userDB.isEmpty) {
      const userDoc = userDB.docs[0];
      const userData = userDoc.data();
      const userType = userData.userType;

      setUserType(userType);
    }
  };

  console.log('data', data);

  useEffect(() => {
    getCurrentUserInfo();
  }, []);

  useEffect(() => {
    if(data?.length > 0) {
      filteredDataRef.current  = data;
      console.log('inside', data, filteredDataRef.current);
    }
  }, [data])

  const tableHooks = (hooks) => {
    if (showViewColumn) {
      hooks.visibleColumns.push((col) => [
        ...col,
        {
          id: "view",
          Header: "View",
          Cell: ({ row }) => (
            <MdIcons.MdOutlineRemoveRedEye
              className="table-icon"
              onClick={() => {
                if (type === "booking") {
                  navigate(`/booking/${row.values.fbId}`);
                } else if (type === "user") {
                  navigate(`/user/${row.values.fbId}`);
                }
              }}
            />
          ),
        },
        {
          id: 'delete',
          Header: 'Delete',
          Cell: ({row}) => <MdIcons.MdDelete  className="table-icon" onClick={(event) => {
            event.preventDefault();
            const shouldDelete = window.confirm(`Are you sure you want to delete the booking for name ${row.values.fullName}?`)
            console.log('values', row.values ,filteredDataRef.current)
            if(shouldDelete){
              updateUsersList(filteredDataRef.current.filter(user => user.id !== +row.values.id))
              database.usersRef.doc(row.values.fbId).delete();
            }
          }}/>
        }
      ]);
    }
  };

  const initialState = { hiddenColumns: ["fbId", "description"] };

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState,
    },
    useGlobalFilter,
    tableHooks,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    preGlobalFilteredRows,
    setGlobalFilter,
    state,
    page,
    pageCount,
    gotoPage,
    nextPage,
    canNextPage,
    previousPage,
    canPreviousPage,
    pageOptions,
  } = tableInstance;

  const { globalFilter, pageIndex } = state;
  const pendingApprovalCount = data.filter(
    (record) => record.approvalStatus === "Pending"
  ).length;
  console.log({ showPendingApprovalCount, userType, pendingApprovalCount,data });


  return (
    <div>
      <div className="mb-3 table-info">
        <div className="event-card booking-card">
          <div className="booking-count">{data.length}</div>
          <div className="title">Bookings</div>
        </div>
        <div className="event-card events-card">
          <div className="booking-count">{data.length}</div>
          <div className="title">Events</div>
        </div>
        {showPendingApprovalCount &&
          userType === "Administrator" &&
          pendingApprovalCount > 0 && (
            <div className="event-card pending-card">
              <div className="booking-count">{pendingApprovalCount}</div>
              <div className="title">Pending</div>
            </div>
          )}
      </div>
      <div className="table-container">
        {enableCalender && (
        <div className="filter-btn-group">
          <Button
            className={`filter_icon calender ${
              activeView == "calender" && "active"
            }`}
            onClick={() => {
              setActiveView("calender");
            }}
          >
            <img src={CalenderIcon} width={25} alt="Calender" />
          </Button>
          <Button
            className={`filter_icon table_icon ${
              activeView == "table" && "active"
            }`}
            onClick={() => {
              setActiveView("table");
            }}
          >
            <img src={TableIcon} width={25} alt="Table" />
          </Button>
        </div>
        )}
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        {showPendingApprovalCount && userType === "Approver" && (
          <p className="pending-approval-count">
            <strong>Pending Approval Requests:</strong>
            <span style={{ color: "red" }}> {pendingApprovalCount}</span>
          </p>
        )}
        {activeView == "calender" && enableCalender ? (
          <div className="calender_wrapper">
            <CalenderView data={data} />
          </div>
        ) : (
          <>
            <Table responsive striped hover {...getTableProps()}>
              <thead>
                {headerGroups.map((headerGroup, i) => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.canSort
                            ? column.getSortByToggleProps()
                            : undefined
                        )}
                        className={
                          column.canSort
                            ? column.isSorted
                              ? column.isSortedDesc
                                ? "-sort-desc"
                                : "-sort-asc"
                              : ""
                            : ""
                        }
                      >
                        {column.render("Header")}
                        <span className="sort-icon">
                          <MdIcons.MdKeyboardArrowDown />
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            {pageOptions.length !== 0 ? (
              <Pagination
                pageIndex={pageIndex}
                pageOptions={pageOptions}
                pageCount={pageCount}
                gotoPage={gotoPage}
                nextPage={nextPage}
                previousPage={previousPage}
                canNextPage={canNextPage}
                canPreviousPage={canPreviousPage}
              />
            ) : (
              <p className="text-center">There are no available records.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TableContainer;
