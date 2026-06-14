import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CButton, CInput } from '~shared/presentation/ui';
import { spacing } from '~shared/presentation/design';

type NoteComposerProps = {
	noteText: string;
	onNoteTextChange: (text: string) => void;
	onAddNote: () => void;
	isCreatingNote: boolean;
};

const NoteComposer = ({
	noteText,
	onNoteTextChange,
	onAddNote,
	isCreatingNote,
}: NoteComposerProps) => (
	<View style={styles.composer}>
		<CInput
			value={noteText}
			onChangeText={onNoteTextChange}
			label="Add note"
			placeholder="Add a private note"
			multiline
		/>
		<CButton
			title="Add note"
			size="sm"
			onPress={onAddNote}
			disabled={!noteText.trim()}
			loading={isCreatingNote}
		/>
	</View>
);

export default NoteComposer;

const styles = StyleSheet.create({
	composer: {
		paddingTop: spacing.md,
	},
});
