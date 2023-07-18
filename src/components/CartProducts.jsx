import React from 'react';
import IndividualCartProduct from './IndividualCartProduct';

const CartProducts = ({ cartProducts,cartProductInc,cartProductdec }) => {
  if (!Array.isArray(cartProducts)) {
    return null; // or handle the case when `cartProducts` is not an array
  }

  return (
    <div>
      {cartProducts.map((product) => (
        <IndividualCartProduct key={product.id} cartProduct={product}
        cartProductInc={cartProductInc} 
        cartProductdec={cartProductdec}/>
      ))}
    </div>
  );
};

export default CartProducts;
