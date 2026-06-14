import CountryPicker, {
	type Country,
	type CountryCode,
} from 'react-native-country-picker-modal';
import React from 'react';

export const DEFAULT_COUNTRY_CODE: CountryCode = 'US';

export const getCountryName = (country: Country) =>
	typeof country.name === 'string' ? country.name : country.name.common;

type CountryPickerModalProps = {
	visible: boolean;
	countryCode: CountryCode;
	onSelect: (country: Country) => void;
	onClose: () => void;
};

export const CountryPickerModal: React.FC<CountryPickerModalProps> = ({
	visible,
	countryCode,
	onSelect,
	onClose,
}) => (
	<CountryPicker
		visible={visible}
		countryCode={countryCode}
		withFilter
		withEmoji
		renderFlagButton={() => null}
		onSelect={onSelect}
		onClose={onClose}
	/>
);

export type { Country, CountryCode };
