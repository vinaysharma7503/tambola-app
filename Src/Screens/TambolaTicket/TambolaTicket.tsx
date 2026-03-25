import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Feather';

interface TambolaTicketProps {
    ticket: number[][];
    markedNumbers: Set<number>;
    onNumberClick?: (num: number) => void;
    calledNumbers?: number[];
    isInteractive?: boolean;
}

export function TambolaTicket({
    ticket,
    markedNumbers,
    onNumberClick,
    calledNumbers = [],
    isInteractive = true,
}: TambolaTicketProps) {
    const isNumberCalled = (num: number) => calledNumbers.includes(num);
    const isNumberMarked = (num: number) => markedNumbers.has(num);

    return (
        <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.ticketId}>Ticket #1234</Text>
                    <Text style={styles.title}>Your Card</Text>
                </View>
                <Text style={styles.emoji}>🎫</Text>
            </View>

            {/* Grid */}
            {ticket.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((num, colIndex) => {
                        const key = `${rowIndex}-${colIndex}`;
                        const isEmpty = num === 0;
                        const isCalled = isNumberCalled(num);
                        const isMarked = isNumberMarked(num);

                        if (isEmpty) {
                            return <View key={key} style={styles.emptyCell} />;
                        }

                        return (
                            <NumberCell
                                key={key}
                                num={num}
                                isCalled={isCalled}
                                isMarked={isMarked}
                                isInteractive={isInteractive}
                                onPress={onNumberClick}
                            />
                        );
                    })}
                </View>
            ))}

            {/* Auto Dab */}
            {isInteractive && (
                <View style={styles.autoDab}>
                    <Text style={styles.autoText}>Auto-dab</Text>
                    <View style={styles.toggle}>
                        <View style={styles.toggleDot} />
                    </View>
                </View>
            )}
        </View>
    );
}

/* ---------------- Cell ---------------- */

function NumberCell({
    num,
    isCalled,
    isMarked,
    isInteractive,
    onPress,
}: any) {
    const scale = useSharedValue(1);
    const pulse = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulse.value }],
        opacity: 2 - pulse.value,
    }));

    React.useEffect(() => {
        if (isCalled && !isMarked) {
            pulse.value = withRepeat(
                withTiming(1.6, { duration: 1000 }),
                -1,
                false
            );
        }
    }, [isCalled, isMarked]);

    return (
        <Pressable
            disabled={!isInteractive}
            onPressIn={() => (scale.value = withSpring(0.95))}
            onPressOut={() => (scale.value = withSpring(1))}
            onPress={() => isInteractive && onPress?.(num)}
        >
            <Animated.View
                style={[
                    styles.cell,
                    isMarked && styles.marked,
                    !isMarked && isCalled && styles.called,
                    animatedStyle,
                ]}
            >
                {isMarked ? (
                    <Icon name="check" size={16} color="#fff" />
                ) : (
                    <Text style={styles.number}>{num}</Text>
                )}

                {isCalled && !isMarked && (
                    <Animated.View style={[styles.pulse, pulseStyle]} />
                )}
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        elevation: 6,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderStyle: 'dashed',
        paddingBottom: 12,
        marginBottom: 12,
    },
    ticketId: {
        fontSize: 12,
        color: '#888',
    },
    title: {
        fontSize: 14,
        color: '#222',
    },
    emoji: {
        fontSize: 32,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    cell: {
        width: 34,
        height: 34,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3f3f3',
        overflow: 'hidden',
    },
    emptyCell: {
        width: 34,
        height: 34,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    },
    number: {
        fontSize: 12,
        color: '#333',
    },
    marked: {
        backgroundColor: '#22c55e',
    },
    called: {
        backgroundColor: '#ffedd5',
        borderWidth: 1,
        borderColor: '#fb923c',
    },
    pulse: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fb923c',
        borderRadius: 8,
    },
    autoDab: {
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    autoText: {
        fontSize: 13,
        color: '#666',
    },
    toggle: {
        width: 48,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#c084fc',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    toggleDot: {
        width: 18,
        height: 18,
        backgroundColor: '#fff',
        borderRadius: 9,
        alignSelf: 'flex-end',
    },
});
