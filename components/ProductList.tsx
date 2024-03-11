import React, { useState, useEffect } from "react";
import { Product, fetchProducts } from "../api/api";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

type FiltredParam = {
  price?: number;
  product?: string;
  brand?: string;
};

const ProductList = () => {
  const [productsId, setProductsId] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [offset, setOffset] = useState(0);
  const limit = 50;
  const [price, setPrice] = useState<number>();
  const [product, setProduct] = useState<string>();
  const [brand, setBrand] = useState<string>();

  const fetchAndSetProducts = async () => {
    const paramsId = {
      action: "get_ids",
      params: { offset: offset, limit: limit },
    };
    const productListId = await fetchProducts(paramsId);
    if (productListId) {
      setProductsId(productListId);

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
  
  const filterAndSetProducts = async () => {
    const filtredParam: FiltredParam = {};
    if (price) {
      filtredParam.price = price;
    }

    if (product) {
      filtredParam.product = product;
    }

    if (brand) {
      filtredParam.brand = brand;
    }

    const paramsFilred = {
      action: "filter",
      params: filtredParam,
    };
    const filtredList = await fetchProducts(paramsFilred);
    if (filtredList) {
      setProductsId(filtredList);

      const params = {
        action: "get_items",
        params: { ids: filtredList },
      };
      const productList = await fetchProducts(params);
      if (productList) {
        setProducts(productList);
      }
    }
  };

  const next = () => {
    setOffset(offset + 50);
  };

  const prev = () => {
    setOffset(offset - 50);
  };

  useEffect(() => {
    fetchAndSetProducts();
  }, [offset]);

  return (
    <Box sx={{ maxWidth: 800, margin: "auto" }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 250 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">
                {" "}
                <TextField
                  type="text"
                  label="Изделие"
                  variant="outlined"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                />
              </TableCell>
              <TableCell align="center">
                {" "}
                <TextField
                  type="text"
                  label="Цена"
                  variant="outlined"
                  value={price}
                  onChange={(e) => setPrice(+e.target.value)}
                />
              </TableCell>
              <TableCell align="center">
                {" "}
                <TextField
                  type="text"
                  label="Бренд"
                  variant="outlined"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </TableCell>
              <TableCell align="center">
                {" "}
                <Button
                  variant="outlined"
                  color="success"
                  onClick={filterAndSetProducts}
                  disabled={!product && !price && !brand}
                >
                  Найти
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((item) => (
              <TableRow key={item.id}>
                <TableCell align="center">{item.product}</TableCell>
                <TableCell align="center">
                  {item.price}
                  {` р`}
                </TableCell>
                <TableCell align="center">{item.brand}</TableCell>
                <TableCell align="center">{item.id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box
          sx={{
            m: 2,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button variant="outlined" disabled={offset === 0} onClick={prev}>
            Предыдущая
          </Button>
          <Button variant="outlined" onClick={next}>
            Следующая
          </Button>
        </Box>
      </TableContainer>
    </Box>
  );
};

export default ProductList;
