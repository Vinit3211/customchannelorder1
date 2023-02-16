import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import LocalizedTextField from '@commercetools-uikit/localized-text-field';
import TextField from '@commercetools-uikit/text-field';
import Spacings from '@commercetools-uikit/spacings';
import SelectField from '@commercetools-uikit/select-field';
import { CHANNEL_ROLES } from './constants';
import { CHANNEL_Venues } from './constants';
import { CHANNEL_DeliveryCountries } from './constants';
import { CHANNEL_CategoryName } from './constants';
import {CHANNEL_CategoryID} from './constants';
import validate from './validate';
import messages from './messages';

const getRoleOptions = Object.keys(CHANNEL_ROLES).map((key) => ({
  label: CHANNEL_ROLES[key],
  value: CHANNEL_ROLES[key],
}));

const getVenuesOptions = Object.keys(CHANNEL_Venues).map((key) => ({
  label: CHANNEL_Venues[key],
  value: CHANNEL_Venues[key],
}));

const getDeliveryCountriesOptions = Object.keys(CHANNEL_DeliveryCountries).map((key) => ({
  label:CHANNEL_DeliveryCountries[key],
  value: CHANNEL_DeliveryCountries[key],
}));

const getCategoryNameOptions = Object.keys(CHANNEL_CategoryName).map((key) => ({
  label: CHANNEL_CategoryName[key],
  value: CHANNEL_CategoryName[key],
}));

const getCategoryIDOptions = Object.keys(CHANNEL_CategoryID).map((key) => ({
  label: CHANNEL_CategoryID[key],
  value: CHANNEL_CategoryID[key],
}));


const ChannelDetailsForm = (props) => {
  const intl = useIntl();
  const formik = useFormik({
    initialValues: props.initialValues,
    onSubmit: props.onSubmit,
    validate,
    enableReinitialize: true,
  });

  const formElements = (
    <Spacings.Stack scale="l">
      <TextField
        name="key"
        title={intl.formatMessage(messages.channelKeyLabel)}
        value={formik.values.key}
        errors={formik.errors.key}
        touched={formik.touched.key}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isReadOnly={props.isReadOnly}
        renderError={(errorKey) => {
          if (errorKey === 'duplicate') {
            return intl.formatMessage(messages.duplicateKey);
          }
          return null;
        }}
        isRequired
        horizontalConstraint={13}
      />
  
      <LocalizedTextField
        name="name"
        title={intl.formatMessage(messages.channelNameLabel)}
        value={formik.values.name}
        errors={formik.errors.name}
        touched={Boolean(formik.touched.name)}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        selectedLanguage={props.dataLocale}
        isReadOnly={props.isReadOnly}
        horizontalConstraint={13}
      />
      
      <SelectField
        name="roles"
        title={intl.formatMessage(messages.channelRolesLabel)}
        value={formik.values.roles}
        errors={formik.errors.roles}
        touched={formik.touched.roles}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isMulti
        options={getRoleOptions}
        isReadOnly={props.isReadOnly}
        isRequired
        horizontalConstraint={13}
      />
      
      <SelectField
        name="venues"
        title={intl.formatMessage(messages.channelVenuesLabel)}
        value={formik.values.venues}
        errors={formik.errors.venues}
        touched={formik.touched.venues}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isMulti
        options={getVenuesOptions}
        isReadOnly={props.isReadOnly}
        isRequired
        horizontalConstraint={13}
      />

<SelectField
        name="deliveryCountries"
        title={intl.formatMessage(messages.channelDeliveryCountriesLabel)}
        value={formik.values.deliveryCountries}
        errors={formik.errors.deliveryCountries}
        touched={formik.touched.deliveryCountries}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isMulti
        options={getDeliveryCountriesOptions}
        isReadOnly={props.isReadOnly}
        isRequired
        horizontalConstraint={13}
      />

<SelectField
        name="categoryName"
        title={intl.formatMessage(messages.channelCategoryNameLabel)}
        value={formik.values.categoryName}
        errors={formik.errors.categoryName}
        touched={formik.touched.categoryName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isMulti
        options={getCategoryNameOptions}
        isReadOnly={props.isReadOnly}
        isRequired
        horizontalConstraint={13}
      />

<SelectField
        name="categoryID"
        title={intl.formatMessage(messages.channelCategoryIDLabel)}
        value={formik.values.categoryID}
        errors={formik.errors.categoryID}
        touched={formik.touched.categoryID}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isMulti
        options={getCategoryIDOptions}
        isReadOnly={props.isReadOnly}
        isRequired
        horizontalConstraint={13}
      />
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
ChannelDetailsForm.displayName = 'ChannelDetailsForm';
ChannelDetailsForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    id: PropTypes.string,
    key: PropTypes.string,
    name: PropTypes.object,
    version: PropTypes.number,
    roles: PropTypes.arrayOf(PropTypes.string.isRequired),
  }),
  isReadOnly: PropTypes.bool.isRequired,
  dataLocale: PropTypes.string.isRequired,
};

export default ChannelDetailsForm;
