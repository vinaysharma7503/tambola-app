import React, { useState } from 'react';
import {
    View,
    Text,
    Pressable,
    TextInput,
    StyleSheet,
    ScrollView,
} from 'react-native';
import Animated, {
    FadeInUp,
    FadeInLeft,
    FadeOutRight,
    ZoomIn,
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface JoinGameProps {
    navigation?: any;
}

export default function JoinGame({ navigation }: JoinGameProps) {
    const [gameCode, setGameCode] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [showTicketSelection, setShowTicketSelection] = useState(false);

    const handleSubmit = () => {
        if (gameCode.length === 6 && playerName.trim()) {
            setShowTicketSelection(true);
        }
    };

    const handleTicketSelect = () => {
        // Navigate to game play screen or handle join logic
        console.log('Joining game with code:', gameCode, 'as', playerName);
    };

    /* ===================== TICKET SELECTION ===================== */

    if (showTicketSelection) {
        return (
            <ScrollView style={styles.container}>
                {/* Back */}
                <Pressable
                    style={styles.backBtn}
                    onPress={() => setShowTicketSelection(false)}
                >
                    <Ionicons name="arrow-back" size={20} color="#374151" />
                </Pressable>

                <Text style={styles.title}>Select Your Ticket</Text>
                <Text style={styles.subTitle}>Choose a ticket to play with</Text>

                {/* Host Info */}
                <Animated.View entering={FadeInUp} style={styles.hostCard}>
                    <View style={styles.hostAvatar}>
                        <Ionicons name="person" size={24} color="#fff" />
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.muted}>Hosted by</Text>
                        <Text style={styles.text}>Rajesh Kumar</Text>
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                        <View style={styles.row}>
                            <Ionicons name="people" size={14} color="#6b7280" />
                            <Text style={styles.muted}> 8/15</Text>
                        </View>
                        <Text style={styles.small}>Players</Text>
                    </View>
                </Animated.View>

                {/* Tickets */}
                {[1, 2, 3].map(ticket => (
                    <Animated.View
                        key={ticket}
                        entering={FadeInLeft.delay(ticket * 100)}
                        exiting={FadeOutRight}
                    >
                        <Pressable
                            style={styles.ticketCard}
                            onPress={handleTicketSelect}
                        >
                            <View style={styles.ticketHeader}>
                                <View style={styles.ticketIcon}>
                                    <Ionicons name="ticket" size={22} color="#7c3aed" />
                                </View>
                                <View>
                                    <Text style={styles.text}>Ticket #{ticket}</Text>
                                    <Text style={styles.muted}>Auto-generated</Text>
                                </View>
                                <Text style={styles.arrow}>→</Text>
                            </View>

                            {/* Mini grid preview */}
                            <View style={styles.grid}>
                                {Array.from({ length: 27 }).map((_, i) => (
                                    <View
                                        key={i}
                                        style={[
                                            styles.gridCell,
                                            Math.random() > 0.3 && styles.gridCellActive,
                                        ]}
                                    />
                                ))}
                            </View>
                        </Pressable>
                    </Animated.View>
                ))}

                {/* Random Ticket */}
                <Pressable style={styles.primaryBtn} onPress={handleTicketSelect}>
                    <Text style={styles.btnText}>🎲 Get Random Ticket</Text>
                </Pressable>
            </ScrollView>
        );
    }

    /* ===================== JOIN SCREEN ===================== */

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Animated.View entering={FadeInUp}>
                {/* Back */}
                <Pressable style={styles.backBtn} onPress={() => navigation?.goBack()}>
                    <Ionicons name="arrow-back" size={20} color="#374151" />
                </Pressable>

                <View style={styles.card}>
                    {/* Icon */}
                    <Animated.View entering={ZoomIn} style={styles.loginIcon}>
                        <Ionicons name="log-in" size={36} color="#fff" />
                    </Animated.View>

                    <Text style={styles.title}>Join Game</Text>
                    <Text style={styles.subTitle}>
                        Enter the game code shared by host
                    </Text>

                    {/* Game Code */}
                    <Text style={styles.label}>Game Code</Text>
                    <TextInput
                        value={gameCode}
                        onChangeText={t => setGameCode(t.toUpperCase().slice(0, 6))}
                        placeholder="Enter 6-digit code"
                        style={styles.codeInput}
                        maxLength={6}
                        autoCapitalize="characters"
                    />

                    {/* Player Name */}
                    <Text style={styles.label}>Your Name</Text>
                    <View style={styles.inputRow}>
                        <Ionicons name="person" size={18} color="#9ca3af" />
                        <TextInput
                            value={playerName}
                            onChangeText={setPlayerName}
                            placeholder="Enter your name"
                            style={styles.nameInput}
                        />
                    </View>

                    {/* Join Button */}
                    <Pressable
                        style={[
                            styles.primaryBtn,
                            (gameCode.length !== 6 || !playerName.trim()) &&
                            styles.disabled,
                        ]}
                        disabled={gameCode.length !== 6 || !playerName.trim()}
                        onPress={handleSubmit}
                    >
                        <Ionicons name="log-in" size={18} color="#fff" />
                        <Text style={styles.btnText}> Join Game</Text>
                    </Pressable>
                </View>

                {/* Footer */}
                <Text style={styles.footerText}>Don't have a game code?</Text>
                <Pressable onPress={() => navigation?.navigate('CreateGame')}>
                    <Text style={styles.link}>Create your own game →</Text>
                </Pressable>
            </Animated.View>
        </ScrollView>
    );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fdf4ff',
        padding: 16,
    },

    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
    },

    loginIcon: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: '#f59e0b',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 16,
    },

    title: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 4,
    },

    subTitle: {
        textAlign: 'center',
        color: '#6b7280',
        marginBottom: 20,
    },

    label: {
        color: '#374151',
        marginBottom: 6,
    },

    codeInput: {
        borderWidth: 2,
        borderColor: '#e5e7eb',
        borderRadius: 14,
        padding: 14,
        fontSize: 22,
        letterSpacing: 6,
        textAlign: 'center',
        marginBottom: 16,
    },

    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e5e7eb',
        borderRadius: 14,
        paddingHorizontal: 12,
        marginBottom: 20,
    },

    nameInput: {
        flex: 1,
        padding: 12,
    },

    primaryBtn: {
        backgroundColor: '#f59e0b',
        padding: 14,
        borderRadius: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },

    disabled: {
        opacity: 0.5,
    },

    btnText: {
        color: '#fff',
        fontWeight: '600',
    },

    footerText: {
        textAlign: 'center',
        color: '#6b7280',
        marginTop: 16,
    },

    link: {
        textAlign: 'center',
        color: '#7c3aed',
        marginTop: 4,
    },

    /* Ticket Selection */

    hostCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 14,
        marginBottom: 16,
    },

    hostAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#7c3aed',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    ticketCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
    },

    ticketHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },

    ticketIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#ede9fe',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },

    arrow: {
        marginLeft: 'auto',
        fontSize: 20,
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
    },

    gridCell: {
        width: '10%',
        aspectRatio: 1,
        backgroundColor: '#f9fafb',
        borderRadius: 4,
    },

    gridCellActive: {
        backgroundColor: '#ede9fe',
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    text: {
        color: '#111827',
    },

    muted: {
        color: '#6b7280',
        fontSize: 12,
    },

    small: {
        fontSize: 11,
        color: '#9ca3af',
    },
});
