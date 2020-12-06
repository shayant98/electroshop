import { CART_ADD_ITEM, CART_REMOVE_ITEM } from "../constants/cartConstants";

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload;
      const existsItem = state.cartItems.find(
        (x) => x.product === item.product
      );

      if (existsItem) {
        return {
          ...state, //WAARVOOR DIT?
          cartItems: state.cartItems.map((item) =>
            item.product === existsItem.product ? item : item
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }
      break;
    case CART_REMOVE_ITEM:
      break;

    default:
      return state;
      break;
  }
};
