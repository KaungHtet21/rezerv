import React, { type ReactNode } from 'react';
import { View, TextInput, TextInputProps, ViewStyle } from 'react-native';
import { useDesign } from '~shared/presentation/design';
import CText from './CText';

interface CInputProps extends TextInputProps {
	label?: string;
	error?: string;
	size?: 'sm' | 'md' | 'lg';
	containerStyle?: ViewStyle;
	rightAccessory?: ReactNode;
}

const CInput: React.FC<CInputProps> = ({
	label,
	error,
	size = 'md',
	containerStyle,
	style,
	rightAccessory,
	multiline,
	...props
}) => {
	const ds = useDesign();
	const height = ds.inputHeight[size];
	const inputTextStyle = ds.textStyle('bodyLarge', 'medium');
	const padRight = rightAccessory ? ds.spacing.lg + 36 : ds.spacing.lg;

	return (
		<View style={[{ marginBottom: ds.spacing.lg }, containerStyle]}>
			{label && (
				<CText
					variant="label"
					weight="medium"
					color={ds.colors.content}
					style={{ marginBottom: ds.spacing.xs }}>
					{label}
				</CText>
			)}
			<View style={{ position: 'relative' }}>
				<TextInput
					placeholderTextColor={ds.colors.placeholder}
					multiline={multiline}
					style={[
						inputTextStyle,
						{
							backgroundColor: ds.colors.inputBackground,
							color: ds.colors.title,
							borderColor: error ? ds.colors.error : ds.colors.border,
							borderWidth: 1,
							borderRadius: ds.radius.md,
							paddingHorizontal: ds.spacing.lg,
							paddingRight: padRight,
							...(multiline
								? {
										height: height * 2.5,
										paddingTop: ds.spacing.md,
										paddingBottom: ds.spacing.md,
										textAlignVertical: 'top',
									}
								: { height }),
						},
						style,
					]}
					{...props}
				/>
				{rightAccessory ? (
					<View
						pointerEvents="box-none"
						style={{
							position: 'absolute',
							right: ds.spacing.sm,
							top: 0,
							bottom: 0,
							justifyContent: 'center',
						}}>
						{rightAccessory}
					</View>
				) : null}
			</View>
			{error ? (
				<CText
					variant="caption"
					color={ds.colors.error}
					style={{ marginTop: ds.spacing.xxs }}>
					{error}
				</CText>
			) : null}
		</View>
	);
};

export default React.memo(CInput);
