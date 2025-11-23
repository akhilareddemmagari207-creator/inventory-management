import React from "react";
import { importCSV } from "../api";

export default function ImportExport({ refresh }) {
  const upload = (e) => {
    const file = e.target.files[0];
    const fd = new FormData();
    fd.append("csvFile", file);

    importCSV(fd).then(() => refresh((v) => !v));
  };

  return (
    <div className="import-export">
      <button onClick={() => document.getElementById("csv").click()}>
        Import CSV
      </button>
      <input id="csv" type="file" style={{ display: "none" }} onChange={upload} />

      <button onClick={() => window.open("http://localhost:5000/api/products/export")}>
        Export CSV
      </button>
    </div>
  );
}
