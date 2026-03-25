import React from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    ScrollView,
    Dimensions,
} from 'react-native';
import Animated, {
    FadeIn,
    FadeInUp,
    ZoomIn,
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface WinnerSummaryProps {
    winners: any[];
    onBackToDashboard: () => void;
}

const { width } = Dimensions.get('window');

/* ================= MOCK DATA ================= */

const mockWinners = [
    {
        id: 1,
        player: { name: 'Priya Sharma', avatar: 'P' },
        pattern: 'Early 5',
        prize: 100,
    },
    {
        id: 2,
        player: { name: 'Rajesh Kumar', avatar: 'R' },
        pattern: 'Top Line',
        prize: 200,
    },
    {
        id: 3,
        player: { name: 'Amit Patel', avatar: 'A' },
        pattern: 'Full House',
        prize: 500,
    },
];

/* ================= COMPONENT ================= */

export default function WinnerSummary({
    winners,
    onBackToDashboard,
}: WinnerSummaryProps) {
    const displayWinners = winners.length ? winners : mockWinners;

    return (
        <View style={styles.container}>
            {/* CONFETTI */}
            {Array.from({ length: 25 }).map((_, i) => (
                <Animated.View
                    key={i}
                    entering={FadeIn.delay(i * 120)}
                    style={[
                        styles.confetti,
                        {
                            left: Math.random() * width,
                            backgroundColor:
                                ['#facc15', '#ec4899', '#22d3ee', '#fb7185'][i % 4],
                        },
                    ]}
                />
            ))}

            <ScrollView contentContainerStyle={styles.content}>
                {/* HEADER */}
                <Animated.View entering={ZoomIn} style={styles.header}>
                    <View style={styles.trophyWrap}>
                        <Ionicons name="trophy" size={60} color="#fff" />
                    </View>

                    <Text style={styles.title}>Game Complete!</Text>
                    <Text style={styles.subTitle}>
                        Congratulations to all winners
                    </Text>
                </Animated.View>

                {/* WINNERS */}
                <View style={styles.list}>
                    {displayWinners.map((winner, index) => (
                        <Animated.View
                            key={winner.id}
                            entering={FadeInUp.delay(200 + index * 120)}
                            style={styles.card}
                        >
                            {/* RANK */}
                            {index === 0 && (
                                <View style={styles.rankBadge}>
                                    <Ionicons name="star" size={18} color="#fff" />
                                </View>
                            )}

                            <View style={styles.row}>
                                <View
                                    style={[
                                        styles.rankCircle,
                                        index === 0
                                            ? styles.gold
                                            : index === 1
                                                ? styles.silver
                                                : styles.bronze,
                                    ]}
                                >
                                    <Text style={styles.rankText}>#{index + 1}</Text>
                                </View>

                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>
                                        {winner.player.avatar}
                                    </Text>
                                </View>

                                <View style={{ flex: 1 }}>
                                    <Text style={styles.name}>{winner.player.name}</Text>
                                    <View style={styles.row}>
                                        <Ionicons
                                            name="pricetag"
                                            size={14}
                                            color="#6b7280"
                                        />
                                        <Text style={styles.pattern}>
                                            {winner.pattern}
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ alignItems: 'flex-end' }}>
                                    <Ionicons
                                        name="cash"
                                        size={22}
                                        color="#eab308"
                                    />
                                    <Text style={styles.prize}>{winner.prize}</Text>
                                </View>
                            </View>
                        </Animated.View>
                    ))}
                </View>

                {/* GAME STATS */}
                <Animated.View
                    entering={FadeInUp.delay(700)}
                    style={styles.statsCard}
                >
                    <Text style={styles.statsTitle}>Game Statistics</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Ionicons name="time" size={26} color="#7c3aed" />
                            <Text style={styles.statValue}>24:35</Text>
                            <Text style={styles.statLabel}>Duration</Text>
                        </View>

                        <View style={styles.stat}>
                            <Ionicons name="grid" size={26} color="#7c3aed" />
                            <Text style={styles.statValue}>67</Text>
                            <Text style={styles.statLabel}>Numbers</Text>
                        </View>

                        <View style={styles.stat}>
                            <Ionicons name="people" size={26} color="#7c3aed" />
                            <Text style={styles.statValue}>12</Text>
                            <Text style={styles.statLabel}>Players</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* ACTIONS */}
                <Animated.View entering={FadeIn.delay(900)}>
                    <Pressable
                        style={styles.primaryBtn}
                        onPress={onBackToDashboard}
                    >
                        <Ionicons name="home" size={18} color="#fff" />
                        <Text style={styles.primaryText}> Back to Dashboard</Text>
                    </Pressable>

                    <Pressable style={styles.secondaryBtn}>
                        <Text style={styles.secondaryText}>Play Again</Text>
                        <Ionicons
                            name="arrow-forward"
                            size={18}
                            color="#7c3aed"
                        />
                    </Pressable>

                    <Pressable>
                        <Text style={styles.share}>Share Results</Text>
                    </Pressable>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fdf4ff',
    },

    content: {
        padding: 16,
        paddingBottom: 100,
    },

    confetti: {
        position: 'absolute',
        top: -20,
        width: 8,
        height: 8,
        borderRadius: 4,
        opacity: 0.7,
    },

    header: {
        alignItems: 'center',
        marginVertical: 20,
    },

    trophyWrap: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f59e0b',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },

    title: {
        fontSize: 22,
        color: '#111827',
        marginBottom: 4,
    },

    subTitle: {
        color: '#6b7280',
    },

    list: {
        marginBottom: 20,
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 14,
        marginBottom: 12,
    },

    rankBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#f59e0b',
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    rankCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },

    rankText: {
        color: '#fff',
        fontWeight: '600',
    },

    gold: { backgroundColor: '#f59e0b' },
    silver: { backgroundColor: '#9ca3af' },
    bronze: { backgroundColor: '#fb923c' },

    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#8b5cf6',
        alignItems: 'center',
        justifyContent: 'center',
    },

    avatarText: {
        color: '#fff',
        fontSize: 18,
    },

    name: {
        fontSize: 14,
        color: '#111827',
    },

    pattern: {
        marginLeft: 6,
        fontSize: 12,
        color: '#6b7280',
    },

    prize: {
        fontSize: 14,
        color: '#111827',
    },

    statsCard: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 16,
        marginBottom: 20,
    },

    statsTitle: {
        textAlign: 'center',
        marginBottom: 12,
        fontSize: 16,
    },

    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },

    stat: {
        alignItems: 'center',
    },

    statValue: {
        fontSize: 18,
        marginTop: 4,
    },

    statLabel: {
        fontSize: 12,
        color: '#6b7280',
    },

    primaryBtn: {
        backgroundColor: '#7c3aed',
        padding: 14,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },

    primaryText: {
        color: '#fff',
        fontWeight: '600',
    },

    secondaryBtn: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e9d5ff',
        padding: 14,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },

    secondaryText: {
        color: '#7c3aed',
        fontWeight: '500',
    },

    share: {
        textAlign: 'center',
        color: '#6b7280',
        paddingVertical: 8,
    },
});
