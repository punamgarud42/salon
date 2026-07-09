import './AdminDataTable.css';

/**
 * AdminDataTable — one table renderer for every admin list view. Columns
 * are {key, label, format?} where format(value, row) returns display text;
 * omit format for a plain value. `actions` renders custom buttons per row
 * (edit/delete for resource managers, status dropdown for list viewers).
 */
export default function AdminDataTable({ columns, rows, actions, emptyMessage = 'No records yet.' }) {
  if (rows.length === 0) {
    return <p className="admin-table__empty">{emptyMessage}</p>;
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => <th key={col.key}>{col.label}</th>)}
            {actions && <th className="admin-table__actions-col">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={col.key}>{col.format ? col.format(row[col.key], row) : String(row[col.key] ?? '')}</td>
              ))}
              {actions && <td className="admin-table__actions-col">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
