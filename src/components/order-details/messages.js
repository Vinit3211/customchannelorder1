import { defineMessages } from 'react-intl';

export default defineMessages({
  backToOrdersList: {
    id: 'OrderDetails.backToOrdersList',
    defaultMessage: 'Back to Orders list',
  },
  duplicateKey: {
    id: 'OrderDetails.duplicateKey',
    defaultMessage: 'A order with this key already exists.',
  },
  orderUpdated: {
    id: 'OrderDetails.orderUpdated',
    defaultMessage: 'Order {orderName} updated',
  },
  orderNumberLabel: {
    id: 'OrderDetails.orderNumberLabel',
    defaultMessage: 'Order number',
  },
  orderStateLabel: {
    id: 'OrderDetails.orderStateLabel',
    defaultMessage: 'Order status',
  },
  customerEmailLabel: {
    id: 'OrderDetails.ustomerEmailLabel',
    defaultMessage: 'customer Email',
  },


  hint: {
    id: 'OrderDetails.hint',
    defaultMessage:
      'This page demonstrates for instance how to use forms, notifications and how to update data using GraphQL, etc.',
  },
  modalTitle: {
    id: 'OrderDetails.modalTitle',
    defaultMessage: 'Edit order',
  },
  orderDetailsErrorMessage: {
    id: 'OrderDetails.errorMessage',
    defaultMessage:
      'We were unable to fetch the order details. Please check your connection, the provided order ID and try again.',
  },
});
