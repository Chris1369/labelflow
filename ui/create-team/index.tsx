import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Input, Button } from '../../components/atoms';
import { theme } from '../../types/theme';
import { useCreateTeamStore } from './useStore';
import { createTeamActions } from './actions';
import { Ionicons } from '@expo/vector-icons';

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
    // Reset form when component mounts
    useCreateTeamStore.getState().resetForm();
  }, []);

  const renderMember = ({ item }: { item: { email: string; id: string } }) => (
    <View style={styles.memberItem}>
      <Text style={styles.memberEmail}>{item.email}</Text>
      <TouchableOpacity
        onPress={() => createTeamActions.removeMember(item.id)}
        style={styles.removeMemberButton}
      >
        <Ionicons name="close-circle" size={24} color={theme.colors.error} />
      </TouchableOpacity>
    </View>
  );

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
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom de l'équipe</Text>
            <Input
              placeholder="Ex: Équipe Marketing"
              value={name}
              onChangeText={setName}
              autoCapitalize="sentences"
              maxLength={50}
            />
            <Text style={styles.charCount}>{name.length}/50</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <Input
              placeholder="Décrivez votre équipe..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={styles.textArea}
              maxLength={200}
            />
            <Text style={styles.charCount}>{description.length}/200</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Inviter des membres</Text>
            <View style={styles.emailInputContainer}>
              <Input
                placeholder="Adresse email"
                value={currentEmail}
                onChangeText={setCurrentEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                containerStyle={styles.emailInput}
              />
              <TouchableOpacity
                style={styles.addEmailButton}
                onPress={createTeamActions.addCurrentEmail}
                disabled={!currentEmail.trim()}
              >
                <Ionicons
                  name="add-circle"
                  size={32}
                  color={currentEmail.trim() ? theme.colors.primary : theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {invitedMembers.length > 0 && (
            <View style={styles.membersContainer}>
              <Text style={styles.membersTitle}>
                Membres invités ({invitedMembers.length})
              </Text>
              <FlatList
                data={invitedMembers}
                keyExtractor={(item) => item.id}
                renderItem={renderMember}
                scrollEnabled={false}
              />
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color={theme.colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={isCreating ? '' : 'Créer l\'équipe'}
            onPress={createTeamActions.createTeam}
            disabled={isCreating}
            style={styles.createButton}
          >
            {isCreating && (
              <ActivityIndicator color={theme.colors.secondary} size="small" />
            )}
          </Button>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={createTeamActions.cancelCreation}
            disabled={isCreating}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
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
  inputGroup: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  textArea: {
    minHeight: 100,
    paddingTop: theme.spacing.md,
  },
  charCount: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'right',
    marginTop: theme.spacing.xs,
  },
  emailInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  emailInput: {
    flex: 1,
    marginBottom: 0,
  },
  addEmailButton: {
    paddingTop: theme.spacing.md,
  },
  membersContainer: {
    marginBottom: theme.spacing.xl,
  },
  membersTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  memberEmail: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    flex: 1,
  },
  removeMemberButton: {
    padding: theme.spacing.xs,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${theme.colors.error}10`,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  errorText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.error,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  buttonContainer: {
    marginTop: theme.spacing.xl,
  },
  createButton: {
    marginBottom: theme.spacing.md,
  },
  cancelButton: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
});