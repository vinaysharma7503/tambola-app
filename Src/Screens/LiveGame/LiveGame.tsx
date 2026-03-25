import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    ScrollView,
} from 'react-native';
import Animated, {
    FadeIn,
    FadeInUp,
    ZoomIn,
} from 'react-native-reanimated';
import {
    ArrowLeft,
    Users,
    MessageCircle,
    Trophy,
    Play,
    Pause,
    MoreVertical,
} from 'lucide-react-native';
import { TambolaTicket } from '../TambolaTicket/TambolaTicket';
// import { GameState } from '../App';
// TODO: Update the import path below to the correct location of GameState
// Example: import { GameState } from '../../types/GameState';

// TEMPORARY: Define GameState type here if not imported from elsewhere
type Ticket = number[][];
type Player = {
    id: string;
    name: string;
    avatar: string;
    tickets: Ticket[];
};
type GameConfig = {
    gameCode: string;
    speed: 'slow' | 'medium' | 'fast';
    type: 'short' | 'full';
};
export interface GameState {
    calledNumbers: number[];
    currentNumber: number | null;
    players: Player[];
    isHost: boolean;
    config: GameConfig;
}

interface LiveGameProps {
    gameState: GameState;
    onClaim: (data: any) => void;
    onBack: () => void;
    onGameEnd: () => void;
}

const winPatterns = [
    { id: 'early5', name: 'Early 5', emoji: '🚀' },
    { id: 'topLine', name: 'Top Line', emoji: '⬆️' },
    { id: 'middleLine', name: 'Middle Line', emoji: '↔️' },
    { id: 'bottomLine', name: 'Bottom Line', emoji: '⬇️' },
    { id: 'fullHouse', name: 'Full House', emoji: '🏠' },
];

export default function LiveGame({
    gameState,
    onClaim,
    onBack,
    onGameEnd,
}: LiveGameProps) {
    const [markedNumbers, setMarkedNumbers] = useState<Set<number>>(new Set());
    const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
    const [numberHistory, setNumberHistory] = useState<number[]>([]);
    const [currentNumber, setCurrentNumber] = useState<number | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [showPlayers, setShowPlayers] = useState(false);

    /* ================= AUTO CALLING ================= */

    useEffect(() => {
        if (!isPlaying || !gameState.isHost) return;

        const speed =
            gameState.config.speed === 'slow'
                ? 10000
                : gameState.config.speed === 'medium'
                    ? 5000
                    : 3000;

        const interval = setInterval(callNextNumber, speed);
        return () => clearInterval(interval);
    }, [isPlaying, calledNumbers]);

    const callNextNumber = () => {
        const max = gameState.config.type === 'short' ? 50 : 90;

        const available = Array.from({ length: max }, (_, i) => i + 1).filter(
            n => !calledNumbers.includes(n),
        );

        if (!available.length) {
            setIsPlaying(false);
            onGameEnd();
            return;
        }

        const next = available[Math.floor(Math.random() * available.length)];
        setCurrentNumber(next);
        setCalledNumbers([...calledNumbers, next]);
        setNumberHistory([next, ...numberHistory]);

        const ticket = gameState.players[0].tickets[0];
        if (ticket.some(row => row.includes(next))) {
            setMarkedNumbers(new Set([...markedNumbers, next]));
        }
    };

    /* ================= INTERACTIONS ================= */

    const handleNumberClick = (num: number) => {
        if (!calledNumbers.includes(num)) return;

        const next = new Set(markedNumbers);
        next.has(num) ? next.delete(num) : next.add(num);
        setMarkedNumbers(next);
    };

    const handleClaim = (pattern: string) => {
        onClaim({
            player: gameState.players[0],
            pattern,
            ticket: gameState.players[0].tickets[0],
            markedNumbers: Array.from(markedNumbers),
        });
    };

    /* ================= UI ================= */

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <Pressable onPress={onBack} style={styles.iconBtn}>
                    <ArrowLeft color="#fff" size={20} />
                </Pressable>

                <View>
                    <Text style={styles.headerSub}>Game Code</Text>
                    <Text style={styles.headerText}>{gameState.config.gameCode}</Text>
                </View>

                <Pressable style={styles.iconBtn}>
                    <MoreVertical color="#fff" size={20} />
                </Pressable>
            </View>

            {/* ACTIONS */}
            <View style={styles.actionRow}>
                <Pressable
                    style={styles.actionBtn}
                    onPress={() => setShowPlayers(!showPlayers)}
                >
                    <Users size={16} color="#fff" />
                    <Text style={styles.actionText}>{gameState.players.length}</Text>
                </Pressable>

                <Pressable
                    style={styles.actionBtn}
                    onPress={() => setShowChat(!showChat)}
                >
                    <MessageCircle size={16} color="#fff" />
                    <Text style={styles.actionText}>Chat</Text>
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                {/* CURRENT NUMBER */}
                <Animated.View entering={FadeInUp} style={styles.cardCenter}>
                    <Text style={styles.muted}>Current Number</Text>

                    <Animated.View entering={ZoomIn} style={styles.numberBall}>
                        <Text style={styles.numberText}>
                            {currentNumber ?? '--'}
                        </Text>
                    </Animated.View>

                    {gameState.isHost && (
                        <Pressable
                            style={[
                                styles.controlBtn,
                                isPlaying ? styles.pause : styles.play,
                            ]}
                            onPress={() => setIsPlaying(!isPlaying)}
                        >
                            {isPlaying ? (
                                <>
                                    <Pause size={18} color="#fff" />
                                    <Text style={styles.controlText}>Pause</Text>
                                </>
                            ) : (
                                <>
                                    <Play size={18} color="#fff" />
                                    <Text style={styles.controlText}>Start</Text>
                                </>
                            )}
                        </Pressable>
                    )}

                    <Text style={styles.muted}>
                        {calledNumbers.length} numbers called
                    </Text>
                </Animated.View>

                {/* HISTORY */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Recent Numbers</Text>
                    <View style={styles.historyRow}>
                        {numberHistory.slice(0, 10).map(n => (
                            <View key={n} style={styles.historyBall}>
                                <Text style={styles.historyText}>{n}</Text>
                            </View>
                        ))}
                        {!numberHistory.length && (
                            <Text style={styles.muted}>No numbers yet</Text>
                        )}
                    </View>
                </View>

                {/* TICKET */}
                <TambolaTicket
                    ticket={gameState.players[0].tickets[0]}
                    markedNumbers={markedNumbers}
                    calledNumbers={calledNumbers}
                    onNumberClick={handleNumberClick}
                    isInteractive
                />

                {/* CLAIM */}
                <View style={styles.card}>
                    <View style={styles.row}>
                        <Trophy size={18} color="#ca8a04" />
                        <Text style={styles.cardTitle}>Claim Win</Text>
                    </View>

                    <View style={styles.claimGrid}>
                        {winPatterns.map(p => (
                            <Pressable
                                key={p.id}
                                style={styles.claimBtn}
                                onPress={() => handleClaim(p.name)}
                            >
                                <Text style={styles.claimEmoji}>{p.emoji}</Text>
                                <Text style={styles.claimText}>{p.name}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* CHAT */}
                {showChat && (
                    <Animated.View entering={FadeIn} style={styles.card}>
                        <Text style={styles.cardTitle}>Chat</Text>
                        <Text style={styles.muted}>😊 Rajesh: Good luck!</Text>
                        <Text style={styles.muted}>🎉 Priya: Let’s go!</Text>
                    </Animated.View>
                )}

                {/* PLAYERS */}
                {showPlayers && (
                    <Animated.View entering={FadeIn} style={styles.card}>
                        <Text style={styles.cardTitle}>
                            Players ({gameState.players.length})
                        </Text>

                        {gameState.players.map(p => (
                            <View key={p.id} style={styles.playerRow}>
                                <View style={styles.avatar}>
                                    <Text>{p.avatar}</Text>
                                </View>
                                <View>
                                    <Text>{p.name}</Text>
                                    <Text style={styles.muted}>
                                        {markedNumbers.size} marked
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </Animated.View>
                )}
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    headerText: { color: '#fff', fontSize: 16 },
    headerSub: { color: '#e9d5ff', fontSize: 12 },

    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    actionRow: {
        flexDirection: 'row',
        gap: 8,
        padding: 12,
    },

    actionBtn: {
        flex: 1,
        backgroundColor: '#8b5cf6',
        padding: 10,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },

    actionText: { color: '#fff' },

    card: {
        backgroundColor: '#fff',
        margin: 12,
        padding: 14,
        borderRadius: 16,
    },

    cardCenter: {
        backgroundColor: '#fff',
        margin: 12,
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
    },

    muted: { color: '#6b7280', fontSize: 12 },

    numberBall: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#7c3aed',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 12,
    },

    numberText: { color: '#fff', fontSize: 42 },

    controlBtn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
        flexDirection: 'row',
        gap: 6,
        marginBottom: 8,
    },

    play: { backgroundColor: '#22c55e' },
    pause: { backgroundColor: '#ef4444' },

    controlText: { color: '#fff' },

    cardTitle: { fontSize: 16, marginBottom: 8 },

    historyRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },

    historyBall: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#ede9fe',
        alignItems: 'center',
        justifyContent: 'center',
    },

    historyText: { color: '#7c3aed' },

    row: { flexDirection: 'row', gap: 6, alignItems: 'center' },

    claimGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

    claimBtn: {
        width: '48%',
        backgroundColor: '#f59e0b',
        padding: 12,
        borderRadius: 14,
        alignItems: 'center',
    },

    claimEmoji: { fontSize: 20 },
    claimText: { color: '#fff', fontSize: 12 },

    playerRow: {
        flexDirection: 'row',
        gap: 10,
        paddingVertical: 6,
        alignItems: 'center',
    },

    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#8b5cf6',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
