import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Monitor, Check } from 'lucide-react-native';

type ThemeMode = 'light' | 'dark' | 'system';

export default function SettingsScreen() {
    const { mode, colors, setMode } = useTheme();

    const themeOptions: { key: ThemeMode; label: string; description: string; icon: any }[] = [
        { key: 'light', label: 'Claro', description: 'Fondo blanco, texto negro', icon: Sun },
        { key: 'dark', label: 'Oscuro', description: 'Fondo negro, texto blanco', icon: Moon },
        { key: 'system', label: 'Sistema', description: 'Sigue la config de tu dispositivo', icon: Monitor },
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Ajustes</Text>

                {/* Theme Section */}
                <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>APARIENCIA</Text>
                <View style={[styles.optionsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    {themeOptions.map((option, index) => {
                        const Icon = option.icon;
                        const isSelected = mode === option.key;
                        return (
                            <TouchableOpacity
                                key={option.key}
                                style={[
                                    styles.optionItem,
                                    { borderBottomColor: colors.surfaceAlt },
                                    index === themeOptions.length - 1 && styles.optionItemLast,
                                ]}
                                onPress={() => setMode(option.key)}
                                activeOpacity={0.6}
                            >
                                <View style={styles.optionLeft}>
                                    <View style={[styles.optionIconBox, { backgroundColor: colors.surfaceAlt }]}>
                                        <Icon size={18} color={isSelected ? colors.text : colors.iconMuted} strokeWidth={1.5} />
                                    </View>
                                    <View>
                                        <Text style={[styles.optionLabel, { color: colors.text }]}>{option.label}</Text>
                                        <Text style={[styles.optionDesc, { color: colors.textMuted }]}>{option.description}</Text>
                                    </View>
                                </View>
                                {isSelected && (
                                    <View style={[styles.checkCircle, { backgroundColor: colors.primary }]}>
                                        <Check size={14} color={colors.primaryText} strokeWidth={2.5} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* About Section */}
                <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>ACERCA DE</Text>
                <View style={[styles.optionsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={[styles.aboutRow, { borderBottomColor: colors.surfaceAlt }]}>
                        <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>Version</Text>
                        <Text style={[styles.aboutValue, { color: colors.textMuted }]}>1.0.0</Text>
                    </View>
                    <View style={[styles.aboutRow, { borderBottomColor: colors.surfaceAlt }]}>
                        <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>Frontend</Text>
                        <Text style={[styles.aboutValue, { color: colors.textMuted }]}>React Native + Expo</Text>
                    </View>
                    <View style={styles.aboutRow}>
                        <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>Backend</Text>
                        <Text style={[styles.aboutValue, { color: colors.textMuted }]}>Laravel API</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 100 },
    headerTitle: { fontSize: 22, fontWeight: '700', marginBottom: 28, letterSpacing: -0.3 },
    sectionTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 10, marginLeft: 4 },
    optionsCard: { borderRadius: 18, overflow: 'hidden', borderWidth: 1, marginBottom: 28 },
    optionItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 16, borderBottomWidth: 1 },
    optionItemLast: { borderBottomWidth: 0 },
    optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
    optionIconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    optionLabel: { fontSize: 14, fontWeight: '600' },
    optionDesc: { fontSize: 11, marginTop: 1, fontWeight: '500' },
    checkCircle: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    aboutRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1 },
    aboutLabel: { fontSize: 14, fontWeight: '500' },
    aboutValue: { fontSize: 13, fontWeight: '500' },
});
