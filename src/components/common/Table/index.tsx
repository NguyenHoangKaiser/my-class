import type { ReactNode } from "react";
import React from "react";

type TableProps = {
  headers: string[];
  rows: ReactNode[][];
};

function Table({ headers, rows }: TableProps) {
  return (
    <table className="min-w-full table-fixed divide-y divide-gray-200 dark:divide-gray-400">
      <thead className="bg-gray-100 dark:bg-gray-700">
        <tr>
          {headers.map((header) => (
            <th
              key={header}
              scope="col"
              className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-200"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-500 dark:bg-gray-800">
        {rows.map((row, rowIndex) => {
          return (
            <tr
              key={rowIndex}
              className="hover:bg-blue-50 dark:hover:bg-gray-700"
            >
              {row.map((column, columnIndex) => (
                <td
                  key={columnIndex}
                  className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {column}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Table;
