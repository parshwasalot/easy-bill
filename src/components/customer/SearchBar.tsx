import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { colors, spacing } from '../../constants/theme';

interface SearchBarProps {
  searchQuery: string;
  onChangeSearch: (query: string) => void;
}

export default function SearchBar({ searchQuery, onChangeSearch }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search customers..."
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchBar}
        iconColor={colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  searchBar: {
    elevation: 0,
    borderWidth: 1,
    borderColor: colors.border,
  },
}); 