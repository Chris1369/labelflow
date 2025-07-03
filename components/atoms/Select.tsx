import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../types/theme';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  value?: string;
  options: Option[];
  disabled?: boolean;
  onChange: (value: string) => void;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  containerStyle?: ViewStyle;
  style?: ViewStyle;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  options,
  disabled,
  onChange,
  error,
  icon,
  containerStyle,
  style,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[styles.select, style, error && styles.selectError]}
        onPress={() => !disabled && setModalVisible(true)}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={error ? theme.colors.error : theme.colors.textSecondary}
            style={styles.icon}
          />
        )}
        <Text style={styles.valueText}>
          {selectedLabel || 'Sélectionner...'}
        </Text>
        <Ionicons
          name='chevron-down'
          size={20}
          color={theme.colors.textSecondary}
        />
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      <Modal visible={modalVisible} transparent animationType='slide'>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.option]}
                  onPress={() => {
                    onChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === value && styles.optionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <Ionicons
                      name='checkmark'
                      size={20}
                      color={theme.colors.primary}
                      style={styles.checkIcon}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.fonts.label,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  selectError: {
    borderColor: theme.colors.error,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  valueText: {
    flex: 1,
    ...theme.fonts.body,
    color: theme.colors.text,
  },
  error: {
    ...theme.fonts.label,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: theme.spacing.md,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    maxHeight: '50%',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  optionText: {
    ...theme.fonts.body,
    color: theme.colors.text,
  },
  optionTextSelected: {
    color: theme.colors.primary,
    fontWeight: '600' as const,
  },
  checkIcon: {
    marginLeft: theme.spacing.sm,
  },
});
