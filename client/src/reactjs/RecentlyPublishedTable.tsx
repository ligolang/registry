import * as React from "react";

export function RecentlyPublishedTable() {
  return (
    <table className="w-full md:w-auto flex-1">
      <thead>
        <tr>
          <th>Recently published</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            leftpad <span className="mg-version">1.0.0</span>{" "}
          </td>
          <td>2 days ago</td>
        </tr>
        <tr>
          <td>
            lambda <span className="mg-version">1.0.0</span>{" "}
          </td>
          <td>2 days ago</td>
        </tr>
        <tr>
          <td>
            lodash <span className="mg-version">1.0.0</span>{" "}
          </td>
          <td>2 days ago</td>
        </tr>
      </tbody>
    </table>
  );
}
