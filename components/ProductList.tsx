import React, { useState, useEffect } from "react";
import { fetchProducts } from "../api/api";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

interface Product {
  brand: string;
  id: string;
  price: number;
  product: string;
}

const ProductList = () => {
  const [productsId, setProductsId] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchAndSetProducts = async () => {
      const paramsId = {
        action: "get_ids",
        params: { offset: 0, limit: 50 },
      };
      const productListId = await fetchProducts(paramsId);
      if (productListId) {
        setProductsId(productListId);
        console.log(productListId);

        const params = {
          action: "get_items",
          params: { ids: productListId },
        };
        const productList = await fetchProducts(params);
        if (productList) {
          setProducts(productList);
        }
      }
    };
    fetchAndSetProducts();
  }, []);

  return (
    <Box sx={{ maxWidth: 800, margin: "auto" }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 250 }} aria-label="simple table">
          <TableHead>
            <TableRow>
            <TableCell align="center">ID</TableCell>
              <TableCell align="center">Изделие</TableCell>
              <TableCell align="center">Цена</TableCell>
              <TableCell align="right">Бренд</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((item) => (
              <TableRow key={item.id}>
                <TableCell align="center">{item.id}</TableCell>
                <TableCell align="center">{item.product}</TableCell>
                <TableCell align="center">
                  {item.price}
                  {` р`}
                </TableCell>
                <TableCell align="right">{item.brand}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductList;
