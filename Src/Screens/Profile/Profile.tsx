import React from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    ScrollView,
} from 'react-native';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ProfileProps {
    navigation?: any;
}

/* ================= DATA ================= */

const stats = [
    { icon: 'trophy', label: 'Games Won', value: '24', bg: '#f59e0b' },
    { icon: 'ticket', label: 'Total Games', value: '87', bg: '#8b5cf6' },
    { icon: 'star', label: 'Total Points', value: '1,250', bg: '#06b6d4' },
];

const achievements = [
    { icon: 'radio-button-on', title: 'First Win', desc: 'Won your first game', unlocked: true },
    { icon: 'flame', title: 'Hot Streak', desc: 'Won 5 games in a row', unlocked: true },
    { icon: 'ribbon', title: 'Champion', desc: 'Won 25 games', unlocked: false },
    { icon: 'flash', title: 'Speed Demon', desc: 'Won in under 5 minutes', unlocked: true },
];

const gameHistory = [
    { id: 1, date: '2 hours ago', result: 'Won', pattern: 'Full House', points: 100 },
    { id: 2, date: 'Yesterday', result: 'Won', pattern: 'Top Line', points: 50 },
    { id: 3, date: '2 days ago', result: 'Lost', pattern: '-', points: 0 },
];

/* ================= COMPONENT ================= */

export default function Profile({ navigation }: ProfileProps) {
    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <Pressable style={styles.iconBtn} onPress={() => navigation?.goBack()}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </Pressable>

                <Text style={styles.headerTitle}>Profile</Text>

                <Pressable style={styles.iconBtn}>
                    <Ionicons name="settings" size={20} color="#fff" />
                </Pressable>

                {/* PROFILE */}
                <View style={styles.profileWrap}>
                    <Animated.View entering={ZoomIn} style={styles.avatar}>
                        <Ionicons name="person" size={40} color="#7c3aed" />
                        <View style={styles.vipBadge}>
                            <Ionicons name="ribbon" size={14} color="#fff" />
                        </View>
                    </Animated.View>

                    <Text style={styles.name}>Priya Sharma</Text>
                    <Text style={styles.email}>priya.sharma@email.com</Text>
                    <Text style={styles.member}>Member since Dec 2024</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* STATS */}
                <Animated.View entering={FadeInUp} style={styles.card}>
                    <View style={styles.statsRow}>
                        {stats.map((s, i) => (
                            <Animated.View
                                key={s.label}
                                entering={FadeInUp.delay(i * 80)}
                                style={styles.stat}
                            >
                                <View style={[styles.statIcon, { backgroundColor: s.bg }]}>
                                    <Ionicons name={s.icon} size={22} color="#fff" />
                                </View>
                                <Text style={styles.statValue}>{s.value}</Text>
                                <Text style={styles.statLabel}>{s.label}</Text>
                            </Animated.View>
                        ))}
                    </View>
                </Animated.View>

                {/* ACHIEVEMENTS */}
                <Animated.View entering={FadeInUp.delay(120)} style={styles.card}>
                    <Text style={styles.cardTitle}>Achievements</Text>

                    <View style={styles.grid}>
                        {achievements.map((a, i) => (
                            <Animated.View
                                key={a.title}
                                entering={FadeInUp.delay(160 + i * 60)}
                                style={[
                                    styles.achievement,
                                    !a.unlocked && styles.locked,
                                ]}
                            >
                                <Ionicons
                                    name={a.icon}
                                    size={26}
                                    color={a.unlocked ? '#7c3aed' : '#9ca3af'}
                                />
                                <Text style={styles.achievementTitle}>{a.title}</Text>
                                <Text style={styles.achievementDesc}>{a.desc}</Text>
                            </Animated.View>
                        ))}
                    </View>
                </Animated.View>

                {/* GAME HISTORY */}
                <Animated.View entering={FadeInUp.delay(200)} style={styles.card}>
                    <View style={styles.rowBetween}>
                        <Text style={styles.cardTitle}>Recent Games</Text>
                        <Text style={styles.link}>View All</Text>
                    </View>

                    {gameHistory.map(g => (
                        <Pressable key={g.id} style={styles.historyRow}>
                            <View>
                                <Text style={styles.historyResult}>
                                    {g.result === 'Won' ? '✓ Won' : '✗ Lost'}
                                </Text>
                                <Text style={styles.muted}>{g.date}</Text>
                            </View>

                            <View style={{ alignItems: 'flex-end' }}>
                                <Text>{g.pattern}</Text>
                                <Text
                                    style={[
                                        styles.points,
                                        g.result === 'Won' && styles.win,
                                    ]}
                                >
                                    {g.points ? `+${g.points}` : '0'}
                                </Text>
                            </View>
                        </Pressable>
                    ))}
                </Animated.View>

                {/* SETTINGS */}
                <Animated.View entering={FadeInUp.delay(280)} style={styles.card}>
                    <Text style={styles.cardTitle}>Settings</Text>

                    {[
                        { icon: 'notifications', label: 'Notifications', value: 'On' },
                        { icon: 'globe-outline', label: 'Language', value: 'English' },
                        { icon: 'person', label: 'Edit Profile', value: '' },
                    ].map(item => (
                        <Pressable key={item.label} style={styles.settingRow}>
                            <View style={styles.row}>
                                <Ionicons name={item.icon} size={18} color="#4b5563" />
                                <Text>{item.label}</Text>
                            </View>
                            <View style={styles.row}>
                                {!!item.value && (
                                    <Text style={styles.muted}>{item.value}</Text>
                                )}
                                <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                            </View>
                        </Pressable>
                    ))}
                </Animated.View>

                {/* LOGOUT */}
                <Animated.View entering={FadeInUp.delay(360)}>
                    <Pressable style={styles.logoutBtn} onPress={() => {
                        // Handle logout - navigate back to login
                        navigation?.navigate('Login');
                    }}>
                        <Ionicons name="log-out" size={18} color="#dc2626" />
                        <Text style={styles.logoutText}>Logout</Text>
                    </Pressable>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fdf4ff' },

    header: {
        backgroundColor: '#7c3aed',
        padding: 16,
        paddingBottom: 80,
        borderBottomLeftRadius: 48,
        borderBottomRightRadius: 48,
    },

    headerTitle: {
        color: '#fff',
        fontSize: 18,
        position: 'absolute',
        alignSelf: 'center',
        top: 20,
    },

    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    profileWrap: {
        alignItems: 'center',
        marginTop: 20,
    },

    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },

    vipBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#f59e0b',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },

    name: { color: '#fff', fontSize: 18 },
    email: { color: '#e9d5ff' },
    member: { color: '#ddd6fe', fontSize: 12, marginTop: 4 },

    content: {
        padding: 16,
        marginTop: -60,
        paddingBottom: 100,
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
    },

    cardTitle: { fontSize: 16, marginBottom: 12 },

    statsRow: { flexDirection: 'row', justifyContent: 'space-between' },

    stat: { alignItems: 'center', width: '30%' },

    statIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },

    statValue: { fontSize: 18 },
    statLabel: { fontSize: 12, color: '#6b7280', textAlign: 'center' },

    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

    achievement: {
        width: '48%',
        padding: 12,
        borderRadius: 14,
        backgroundColor: '#faf5ff',
        alignItems: 'center',
    },

    locked: { opacity: 0.5 },

    achievementTitle: { marginTop: 6, fontSize: 13 },
    achievementDesc: { fontSize: 11, color: '#6b7280', textAlign: 'center' },

    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },

    historyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: '#f9fafb',
        borderRadius: 14,
        marginBottom: 8,
    },

    historyResult: { fontSize: 14 },
    muted: { fontSize: 12, color: '#6b7280' },
    points: { fontSize: 12 },
    win: { color: '#16a34a' },

    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },

    row: { flexDirection: 'row', alignItems: 'center', gap: 10 },

    link: { color: '#7c3aed', fontSize: 12 },

    logoutBtn: {
        flexDirection: 'row',
        gap: 8,
        padding: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#fecaca',
        backgroundColor: '#fef2f2',
        alignItems: 'center',
        justifyContent: 'center',
    },

    logoutText: { color: '#dc2626', fontWeight: '600' },
});
