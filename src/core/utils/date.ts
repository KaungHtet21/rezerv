export const formatDateISO = (date: Date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

export const parseDateISO = (value: string) => {
	const [year, month, day] = value.split('-').map(Number);
	if (!year || !month || !day) return null;
	return new Date(year, month - 1, day);
};

export const formatDateLabel = (value: string) => {
	const date = parseDateISO(value);
	if (!date) return value;
	return date.toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
};

export const getTodayISO = () => formatDateISO(new Date());

export const getClassesScreenTitle = (dateISO: string) => {
	if (dateISO === getTodayISO()) {
		return "Today's Classes";
	}
	return `${formatDateLabel(dateISO)} Classes`;
};

export const getClassesEmptyMessage = (dateISO: string) => {
	if (dateISO === getTodayISO()) {
		return 'No classes today';
	}
	return `No classes on ${formatDateLabel(dateISO)}`;
};

export const DEFAULT_DOB = new Date(1995, 5, 15);

export const MIN_DOB = new Date(1900, 0, 1);

export const MAX_DOB = new Date(2016, 11, 31);
