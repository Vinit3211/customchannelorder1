import LocalizedTextInput from '@commercetools-uikit/localized-text-input';
import { transformLocalizedFieldToLocalizedString } from '@commercetools-frontend/l10n';

export const docToFormValues = (channel, languages) => ({
  key: channel?.key ?? '',
  roles: channel?.roles ?? [],
  venues: channel?.venues?? [],
  deliveryCountries: channel?.deliveryCountries?? [],
  name: LocalizedTextInput.createLocalizedString(
    languages,
    transformLocalizedFieldToLocalizedString(channel?.nameAllLocales ?? [])
  ),
});

export const formValuesToDoc = (formValues) => ({
  key: formValues.key,
  roles: formValues.roles,
  venues: formValues.venues,
  deliveryCountries: formValues.deliveryCountries,
  name: LocalizedTextInput.omitEmptyTranslations(formValues.name),
});
