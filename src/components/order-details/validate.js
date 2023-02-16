import TextInput from '@commercetools-uikit/text-input';
import omitEmpty from 'omit-empty-es';

const validate = (formikValues) => {
  const errors = {
    orderState: {},
    orderNumber: {},
    //categoryName:{}
  };

  if (TextInput.isEmpty(formikValues.key)) {
    errors.orderState.missing = true;
  }
  if (Array.isArray(formikValues.orderNumber) && formikValues.orderNumber.length === 0) {
    errors.orderNumber.missing = true;
  }
  return omitEmpty(errors);
};

export default validate;
