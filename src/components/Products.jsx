import React from 'react'
import './style.css'
import { IndividualProduct } from './IndividualProduct';

const Products = ({ products, addToCart }) => (
  products.map((individualproduct) => (
    <IndividualProduct key={individualproduct.id}
      addToCart={addToCart}
      individualproduct={individualproduct} />
  ))
);

export default Products;
