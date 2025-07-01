import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { theme } from '@/types/theme';
import { useCreateTeamStore } from './useStore';
import { createTeamActions } from './actions';
import {
  TeamNameInput,
  TeamDescriptionInput,
  MemberInviteSection,
  InvitedMembersList,
  ErrorMessage,
  ActionButtons,
} from './components';

export const CreateTeamScreen: React.FC = () => {
  const {
    name,
    description,
    invitedMembers,
    currentEmail,
    isCreating,
    error,
    setName,
    setDescription,
    setCurrentEmail,
  } = useCreateTeamStore();

  useEffect(() => {
    useCreateTeamStore.getState().resetForm();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          <TeamNameInput
            value={name}
            onChange={setName}
          />

          <TeamDescriptionInput
            value={description}
            onChange={setDescription}
          />

          <MemberInviteSection
            currentEmail={currentEmail}
            onEmailChange={setCurrentEmail}
            onAddEmail={createTeamActions.addCurrentEmail}
          />

          <InvitedMembersList members={invitedMembers} />

          <ErrorMessage error={error} />
        </View>

        <ActionButtons
          isCreating={isCreating}
          onCreate={createTeamActions.createTeam}
          onCancel={createTeamActions.cancelCreation}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  form: {
    flex: 1,
  },
});