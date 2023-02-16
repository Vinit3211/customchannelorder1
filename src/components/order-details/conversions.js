
import TextField from '@commercetools-uikit/text-field';
import LocalizedTextInput from '@commercetools-uikit/localized-text-input';
import { transformLocalizedFieldToLocalizedString } from '@commercetools-frontend/l10n';

export const docToFormValues = (order, languages) => ({
  orderNumber: order?.orderNumber ?? '',
  orderState: order?.orderState ?? '',
  customerEmail: order?.customerEmail?? '',
  orderNumber: LocalizedTextInput.createLocalizedString(
    languages,
    transformLocalizedFieldToLocalizedString(order?.nameAllLocales ?? [])
  ),
});

export const formValuesToDoc = (formValues) => ({
  orderNumber: formValues.orderNumber,
  orderState: formValues.orderState,
  customerEmail: formValues.customerEmail,
  orderNumber: TextField.omitEmptyTranslations(formValues.orderNumber),
});
