import PropTypes from 'prop-types';
//  import NumberField from '@commercetools-uikit/number-field';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
 import LocalizedTextField from '@commercetools-uikit/localized-text-field';
import TextField from '@commercetools-uikit/text-field';
import Spacings from '@commercetools-uikit/spacings';
import { ORDER_NUMBER } from './constants';
import { ORDER_STATUS } from './constants';
import { ORDER_EMAIL } from './constants';
//import { ORDER_CREATEDAT } from './constants';
import validate from './validate';
import messages from './messages';

const getOrderNumberOptions = Object.keys(ORDER_NUMBER).map((key) => ({
  label: ORDER_NUMBER[key],
  value: ORDER_NUMBER[key],
}));

const getOrderStateOptions = Object.keys(ORDER_STATUS).map((key) => ({
  label: ORDER_STATUS[key],
  value: ORDER_STATUS[key],
}));

const getCustomerEmailOptions = Object.keys(ORDER_EMAIL).map((key) => ({
  label: ORDER_EMAIL[key],
  value: ORDER_EMAIL[key],
}));

// const getOrderCreatedAtOptions = Object.keys(ORDER_CREATEDAT).map((key) => ({
//   label: ORDER_CREATEDAT[key],
//   value: ORDER_CREATEDAT[key],
// }));

const OrderDetailsForm = (props) => {
  const intl = useIntl();
  const formik = useFormik({
    initialValues: props.initialValues,
    onSubmit: props.onSubmit,
    validate,
    enableReinitialize: true,
  });

  
  const formElements = (
    <Spacings.Stack scale="l">
    <LocalizedTextField
        name="orderNumber"
        title={intl.formatMessage(messages.orderNumberLabel)}
        value={formik.values.orderNumber}
        errors={formik.errors.orderNumber}
        touched={Boolean(formik.touched.orderNumber)}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        selectedLanguage={props.dataLocale}
        options={getOrderNumberOptions}
        isReadOnly={props.isReadOnly}
         horizontalConstraint={10}
      />

      <TextField
        name="orderState"
        title={intl.formatMessage(messages.orderStateLabel)}
        value={formik.values.orderState}
        errors={formik.errors.orderState}
        touched={Boolean(formik.touched.orderState)}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        options={getOrderStateOptions}
        selectedLanguage={props.dataLocale}
        isReadOnly={props.isReadOnly}
         horizontalConstraint={10}
      />
      
      <TextField
        name="customerEmail"
        title={intl.formatMessage(messages.customerEmailLabel)}
        value={formik.values.customerEmail}
        errors={formik.errors.customerEmail}
        touched={formik.touched.customerEmail}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isMulti
        options={getCustomerEmailOptions}
        isReadOnly={props.isReadOnly}
        isRequired
         horizontalConstraint={15}
      />  

       {/* <TextField
        name="orderCreatedAt"
        title={intl.formatMessage(messages.orderCreatedAtLabel)}
        value={formik.values.orderCreatedAt}
        errors={formik.errors.orderCreatedAt}
        touched={formik.touched.orderCreatedAt}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isMulti
        options={getOrderCreatedAtOptions}
        isReadOnly={props.isReadOnly}
        isRequired
         horizontalConstraint={15}
      />  */}



    </Spacings.Stack>
  );

  return props.children({
    formElements,
    values: formik.values,
    isDirty: formik.dirty,
    
    isSubmitting: formik.isSubmitting,
    submitForm: formik.handleSubmit,
    handleReset: formik.handleReset,
  });
};
OrderDetailsForm.displayName = 'OrderDetailsForm';
OrderDetailsForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    orderNumber: PropTypes.string,
    orderState: PropTypes.string,
    customerEmail: PropTypes.arrayOf(PropTypes.string.isRequired),
    
   
  }),
  isReadOnly: PropTypes.bool.isRequired,
  dataLocale: PropTypes.string.isRequired,
};

export default OrderDetailsForm;
 