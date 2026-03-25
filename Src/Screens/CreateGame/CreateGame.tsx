import React, { useState } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    ScrollView,
} from 'react-native';
import Animated,
{
    FadeInRight,
    FadeOutLeft,
    ZoomIn,
} from 'react-native-reanimated';
import Clipboard from '@react-native-clipboard/clipboard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface GameConfig {
    speed: 'slow' | 'medium' | 'fast';
    type: 'classic' | 'short' | 'custom';
    patterns: string[];
    maxPlayers: number;
    ticketPrice: number;
    gameCode: string;
}

interface Props {
    navigation?: any;
}

const PATTERNS = [
    'Early 5',
    'Top Line',
    'Middle Line',
    'Bottom Line',
    'Full House',
    'Four Corners',
    'Star Pattern',
    'Quick 7',
];

export default function CreateGame({ navigation }: Props) {
    const [step, setStep] = useState(1);
    const [showShare, setShowShare] = useState(false);
    const [gameCode, setGameCode] = useState('');

    const [config, setConfig] = useState<Partial<GameConfig>>({
        speed: 'medium',
        type: 'classic',
        patterns: ['Early 5', 'Top Line', 'Full House'],
        maxPlayers: 10,
        ticketPrice: 0,
    });

    const generateGameCode = () =>
        Math.random().toString(36).substring(2, 8).toUpperCase();

    const handleCreate = () => {
        const code = generateGameCode();
        setGameCode(code);
        setShowShare(true);
    };

    const handleStartGame = () => {
        // Navigate to game screen
        navigation?.navigate('LiveGame', {
            gameCode,
            config
        });
    };

    const copyCode = () => Clipboard.setString(gameCode);

    const togglePattern = (pattern: string) => {
        const list = config.patterns || [];
        setConfig({
            ...config,
            patterns: list.includes(pattern)
                ? list.filter(p => p !== pattern)
                : [...list, pattern],
        });
    };

    /* ================= SHARE SCREEN ================= */

    if (showShare) {
        return (
            <View style={styles.container}>
                <Animated.View entering={ZoomIn} style={styles.card}>
                    <View style={styles.successCircle}>
                        <Ionicons name="checkmark" size={48} color="#fff" />
                    </View>

                    <Text style={styles.title}>Game Created!</Text>
                    <Text style={styles.subTitle}>Share this code</Text>

                    <View style={styles.codeBox}>
                        <Text style={styles.code}>{gameCode}</Text>

                        <Pressable onPress={copyCode} style={styles.copyBtn}>
                            <Ionicons name="copy-outline" size={16} color="#7c3aed" />
                            <Text style={styles.copyText}>Copy</Text>
                        </Pressable>
                    </View>

                    <Pressable style={styles.primaryBtn}>
                        <Ionicons name="share-social-outline" size={18} color="#fff" />
                        <Text style={styles.btnText}>Share via WhatsApp</Text>
                    </Pressable>

                    <Pressable style={styles.primaryBtn} onPress={handleStartGame}>
                        <Text style={styles.btnText}>Start Game</Text>
                    </Pressable>
                </Animated.View>
            </View>
        );
    }

    /* ================= MAIN FLOW ================= */

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation?.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={20} color="#1F2937" />
                </Pressable>
                <Text style={styles.headerTitle}>Create New Game</Text>
            </View>

            {/* Step 1 */}
            {step === 1 && (
                <Animated.View
                    entering={FadeInRight}
                    exiting={FadeOutLeft}
                    style={styles.card}
                >
                    <Text style={styles.title}>Game Settings</Text>

                    <Text style={styles.label}>Game Type</Text>
                    <View style={styles.row}>
                        {['classic', 'short', 'custom'].map(type => (
                            <Pressable
                                key={type}
                                style={[
                                    styles.option,
                                    config.type === type && styles.optionActive,
                                ]}
                                onPress={() => setConfig({ ...config, type: type as any })}
                            >
                                <Text>{type}</Text>
                            </Pressable>
                        ))}
                    </View>

                    <Text style={styles.label}>Calling Speed</Text>
                    <View style={styles.row}>
                        {[
                            { v: 'slow', icon: 'time-outline' },
                            { v: 'medium', icon: 'speedometer-outline' },
                            { v: 'fast', icon: 'flash-outline' },
                        ].map(s => (
                            <Pressable
                                key={s.v}
                                style={[
                                    styles.option,
                                    config.speed === s.v && styles.optionActive,
                                ]}
                                onPress={() => setConfig({ ...config, speed: s.v as any })}
                            >
                                <Ionicons name={s.icon} size={18} />
                                <Text>{s.v}</Text>
                            </Pressable>
                        ))}
                    </View>

                    <Pressable style={styles.primaryBtn} onPress={() => setStep(2)}>
                        <Text style={styles.btnText}>Continue</Text>
                    </Pressable>
                </Animated.View>
            )}

            {/* Step 2 */}
            {step === 2 && (
                <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.card}>
                    <Text style={styles.title}>Winning Patterns</Text>

                    <View style={styles.grid}>
                        {PATTERNS.map(p => (
                            <Pressable
                                key={p}
                                onPress={() => togglePattern(p)}
                                style={[
                                    styles.pattern,
                                    config.patterns?.includes(p) && styles.optionActive,
                                ]}
                            >
                                <Text>{p}</Text>
                                {config.patterns?.includes(p) && <Ionicons name="checkmark" size={16} />}
                            </Pressable>
                        ))}
                    </View>

                    <View style={styles.row}>
                        <Pressable style={styles.secondaryBtn} onPress={() => setStep(1)}>
                            <Text>Back</Text>
                        </Pressable>
                        <Pressable
                            style={styles.primaryBtn}
                            onPress={() => setStep(3)}
                        >
                            <Text style={styles.btnText}>Continue</Text>
                        </Pressable>
                    </View>
                </Animated.View>
            )}

            {/* Step 3 */}
            {step === 3 && (
                <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.card}>
                    <Text style={styles.title}>Game Details</Text>

                    <Text style={styles.label}>Max Players: {config.maxPlayers}</Text>
                    <View style={styles.row}>
                        <Pressable
                            style={styles.counterBtn}
                            onPress={() => setConfig({ ...config, maxPlayers: Math.max(2, (config.maxPlayers || 10) - 1) })}
                        >
                            <Ionicons name="remove" size={20} />
                        </Pressable>
                        <Text style={styles.counterValue}>{config.maxPlayers}</Text>
                        <Pressable
                            style={styles.counterBtn}
                            onPress={() => setConfig({ ...config, maxPlayers: Math.min(50, (config.maxPlayers || 10) + 1) })}
                        >
                            <Ionicons name="add" size={20} />
                        </Pressable>
                    </View>

                    <Text style={styles.label}>Ticket Price</Text>
                    <View style={styles.row}>
                        {[0, 10, 50, 100].map(p => (
                            <Pressable
                                key={p}
                                style={[
                                    styles.option,
                                    config.ticketPrice === p && styles.optionActive,
                                ]}
                                onPress={() => setConfig({ ...config, ticketPrice: p })}
                            >
                                <Text>{p === 0 ? 'Free' : p}</Text>
                            </Pressable>
                        ))}
                    </View>

                    <Pressable style={styles.primaryBtn} onPress={handleCreate}>
                        <Ionicons name="ticket-outline" size={18} color="#fff" />
                        <Text style={styles.btnText}>Create Game</Text>
                    </Pressable>
                </Animated.View>
            )}
        </ScrollView>
    );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fdf4ff', padding: 16 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    backBtn: { marginRight: 12 },
    headerTitle: { color: '#fff', fontSize: 18 },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        marginBottom: 20,
    },
    title: { fontSize: 18, marginBottom: 12 },
    subTitle: { color: '#666', marginBottom: 12 },
    label: { marginVertical: 8, color: '#444' },
    row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    option: {
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    optionActive: {
        borderColor: '#7c3aed',
        backgroundColor: '#f3e8ff',
    },
    pattern: {
        width: '48%',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    primaryBtn: {
        marginTop: 12,
        padding: 14,
        borderRadius: 14,
        backgroundColor: '#7c3aed',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    secondaryBtn: {
        padding: 14,
        borderRadius: 14,
        backgroundColor: '#eee',
    },
    btnText: { color: '#fff', fontWeight: '600' },
    successCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#22c55e',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 16,
    },
    codeBox: {
        padding: 16,
        borderRadius: 14,
        backgroundColor: '#f3e8ff',
        alignItems: 'center',
        marginBottom: 16,
    },
    code: { fontSize: 28, letterSpacing: 4, marginBottom: 8 },
    copyBtn: { flexDirection: 'row', gap: 6 },
    copyText: { color: '#7c3aed' },
    counterBtn: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#f3e8ff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#7c3aed',
    },
    counterValue: {
        fontSize: 24,
        fontWeight: '600',
        marginHorizontal: 24,
    },
});
