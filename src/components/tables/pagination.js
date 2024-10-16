import React from 'react'

/**
 * @function Pagination
 * 
 * It's a function that returns a div with a react-table pagination feature in it.
 * @returns A React component that renders a pagination control.
 */
const Pagination = ({
    pageIndex,
    pageOptions,
    //pageCount,
    //gotoPage,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage }) => {

    return (
        <div className={"table-pagination"}>
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                {'Prev'}
            </button>
            <span className='pagination'>
                Page:&nbsp;
                <strong>
                    {pageIndex + 1}
                </strong>
                &nbsp;of&nbsp;
                <strong>
                    {pageOptions.length}
                </strong>
            </span>
            <button onClick={() => nextPage()} disabled={!canNextPage}>
                {'Next'}
            </button>
        </div>
    )
}

export default Pagination