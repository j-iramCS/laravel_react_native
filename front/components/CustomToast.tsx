import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BaseToast, ErrorToast, BaseToastProps } from 'react-native-toast-message';
import { useTheme } from '@/context/ThemeContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react-native';

// ─── Custom toast configs that match the app's minimalist style ───
export function useToastConfig() {
    const { colors } = useTheme();

    return {
        success: (props: BaseToastProps) => (
            <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                    <CheckCircle2 size={18} color="#2E7D32" strokeWidth={2} />
                </View>
                <View style={styles.content}>
                    <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                        {props.text1}
                    </Text>
                    {props.text2 ? (
                        <Text style={[styles.message, { color: colors.textMuted }]} numberOfLines={2}>
                            {props.text2}
                        </Text>
                    ) : null}
                </View>
                <TouchableOpacity onPress={props.onPress} style={styles.closeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <X size={16} color={colors.textPlaceholder} strokeWidth={2} />
                </TouchableOpacity>
            </View>
        ),

        error: (props: BaseToastProps) => (
            <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}>
                    <AlertCircle size={18} color="#C62828" strokeWidth={2} />
                </View>
                <View style={styles.content}>
                    <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                        {props.text1}
                    </Text>
                    {props.text2 ? (
                        <Text style={[styles.message, { color: colors.textMuted }]} numberOfLines={2}>
                            {props.text2}
                        </Text>
                    ) : null}
                </View>
                <TouchableOpacity onPress={props.onPress} style={styles.closeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <X size={16} color={colors.textPlaceholder} strokeWidth={2} />
                </TouchableOpacity>
            </View>
        ),

        info: (props: BaseToastProps) => (
            <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.iconBox, { backgroundColor: colors.surfaceAlt }]}>
                    <Info size={18} color={colors.icon} strokeWidth={2} />
                </View>
                <View style={styles.content}>
                    <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                        {props.text1}
                    </Text>
                    {props.text2 ? (
                        <Text style={[styles.message, { color: colors.textMuted }]} numberOfLines={2}>
                            {props.text2}
                        </Text>
                    ) : null}
                </View>
                <TouchableOpacity onPress={props.onPress} style={styles.closeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <X size={16} color={colors.textPlaceholder} strokeWidth={2} />
                </TouchableOpacity>
            </View>
        ),
    };
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        maxWidth: 400,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 1,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 8,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: -0.1,
    },
    message: {
        fontSize: 12,
        marginTop: 2,
        fontWeight: '500',
        lineHeight: 16,
    },
    closeBtn: {
        padding: 4,
    },
});
