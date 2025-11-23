import React, { useEffect, useState } from "react";
import { getHistory } from "../api";

export default function InventoryHistory({ product, close }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    getHistory(product.id).then((res) => setLogs(res.data));
  }, []);

  return (
    <div className="sidebar">
      <h2>{product.name} – History</h2>
      <button onClick={close}>Close</button>

      {logs.map((log) => (
        <div className="log">
          <p>Old Qty: {log.old_quantity}</p>
          <p>New Qty: {log.new_quantity}</p>
          <p>Date: {log.change_date}</p>
        </div>
      ))}
    </div>
  );
}
