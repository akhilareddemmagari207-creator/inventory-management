import React, { useState } from "react";
import { updateProduct } from "../api";

export default function ProductRow({ product, setHistory }) {
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState(product);

  const save = () => {
    updateProduct(product.id, data).then(() => {
      setEdit(false);
      window.location.reload();
    });
  };

  return (
    <tr>
      <td>
        {edit ? (
          <input
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
        ) : (
          product.name
        )}
      </td>

      <td>
        {edit ? (
          <input
            value={data.unit}
            onChange={(e) => setData({ ...data, unit: e.target.value })}
          />
        ) : (
          product.unit
        )}
      </td>

      <td>{edit ? <input
        value={data.category}
        onChange={(e) => setData({ ...data, category: e.target.value })}
      /> : product.category}</td>

      <td>{edit ? <input
        value={data.brand}
        onChange={(e) => setData({ ...data, brand: e.target.value })}
      /> : product.brand}</td>

      <td>
        {edit ? (
          <input
            type="number"
            value={data.stock}
            onChange={(e) => setData({ ...data, stock: Number(e.target.value) })}
          />
        ) : (
          product.stock
        )}
      </td>

      <td
        className={product.stock === 0 ? "out" : "in"}
      >
        {product.stock === 0 ? "Out of Stock" : "In Stock"}
      </td>

      <td>
        {edit ? (
          <button onClick={save}>Save</button>
        ) : (
          <button onClick={() => setEdit(true)}>Edit</button>
        )}

        <button onClick={() => setHistory(product)}>History</button>
      </td>
    </tr>
  );
}
