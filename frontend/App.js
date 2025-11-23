import React, { useEffect, useState } from "react";
import "./App.css";
import ProductTable from "./Components/ProductTable";
import ImportExport from "./components/ImportExport";

function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="container">
      <h1>Inventory Management</h1>

      <ImportExport refresh={setRefresh} />

      <ProductTable refresh={refresh} />
    </div>
  );
}

export default App;
