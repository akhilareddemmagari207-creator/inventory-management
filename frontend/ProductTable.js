import React, { useEffect, useState } from "react";
import { getProducts } from "../api";
import ProductRow from "./ProductRow";
import InventoryHistory from "./InventoryHistory";

export default function ProductTable({ refresh }) {
  const [products, setProducts] = useState([]);
  const [historyProduct, setHistoryProduct] = useState(null);

  useEffect(() => {
    getProducts().then((res) => setProducts(res.data));
  }, [refresh]);

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Unit</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <ProductRow key={p.id} product={p} setHistory={setHistoryProduct} />
          ))}
        </tbody>
      </table>

      {historyProduct && (
        <InventoryHistory
          product={historyProduct}
          close={() => setHistoryProduct(null)}
        />
      )}
    </div>
  );
}
