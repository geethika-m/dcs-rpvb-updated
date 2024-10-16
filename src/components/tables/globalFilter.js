import React, { useState } from "react";
import { useAsyncDebounce } from "react-table";

/**
 * @function GlobalFilter
 *
 * React-Tabble's GlobalFilter feature for data searching
 *
 * @returns A React component that renders a search bar.
 */
const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) => {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((val) => {
    setGlobalFilter(val || undefined);
  }, 300);

  return (
    <div className={"table-search-bar"}>
      <div className="form-outline">
        <input
          type="search"
          className={"form-control"}
          value={value || ""}
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
          placeholder={count + " records..."}
        />
      </div>
    </div>
  );
};

export default GlobalFilter;
