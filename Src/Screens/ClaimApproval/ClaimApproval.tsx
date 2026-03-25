import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';

interface ClaimApprovalProps {
    claim: any;
    visible: boolean;
    onApprove: () => void;
    onReject: () => void;
    onClose: () => void;
}

export function ClaimApproval({
    claim,
    visible,
    onApprove,
    onReject,
    onClose
}: ClaimApprovalProps) {
    const ticket = claim.ticket;
    const markedNumbers = new Set(claim.markedNumbers);
    const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
    const opacityAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 100,
                    friction: 8,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            scaleAnim.setValue(0.9);
            opacityAnim.setValue(0);
        }
    }, [visible, scaleAnim, opacityAnim]);

    // Validate the claim
    const validateClaim = () => {
        // Simple validation - check if pattern is complete
        // In real app, would check specific pattern logic
        return markedNumbers.size >= 5;
    };

    const isValid = validateClaim();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Animated.View
                    style={[
                        styles.container,
                        {
                            transform: [{ scale: scaleAnim }],
                            opacity: opacityAnim,
                        },
                    ]}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <LinearGradient
                                colors={['#FBBF24', '#F97316']}
                                style={styles.iconBadge}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Icon name="award" size={40} color="#fff" />
                            </LinearGradient>
                            <Text style={styles.title}>Claim Received!</Text>
                            <Text style={styles.subtitle}>
                                {claim.player.name} is claiming {claim.pattern}
                            </Text>
                        </View>

                        {/* Ticket Display */}
                        <LinearGradient
                            colors={['#FAF5FF', '#FCE7F3']}
                            style={styles.ticketContainer}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Text style={styles.ticketTitle}>Ticket Verification</Text>
                            <View style={styles.ticketGrid}>
                                {ticket.map((row: number[], rowIndex: number) => (
                                    <View key={rowIndex} style={styles.ticketRow}>
                                        {row.map((num: number, colIndex: number) => {
                                            const isEmpty = num === 0;
                                            const isMarked = markedNumbers.has(num);

                                            if (isEmpty) {
                                                return (
                                                    <View
                                                        key={`${rowIndex}-${colIndex}`}
                                                        style={styles.emptyCell}
                                                    />
                                                );
                                            }

                                            return (
                                                <View
                                                    key={`${rowIndex}-${colIndex}`}
                                                    style={[
                                                        styles.cell,
                                                        isMarked ? styles.markedCell : styles.unmarkedCell,
                                                    ]}
                                                >
                                                    {isMarked ? (
                                                        <Icon name="check" size={12} color="#fff" />
                                                    ) : (
                                                        <Text style={styles.cellText}>{num}</Text>
                                                    )}
                                                </View>
                                            );
                                        })}
                                    </View>
                                ))}
                            </View>
                        </LinearGradient>

                        {/* Marked Numbers */}
                        <View style={styles.markedSection}>
                            <Text style={styles.markedTitle}>
                                Marked Numbers: {markedNumbers.size}
                            </Text>
                            <View style={styles.markedGrid}>
                                {Array.from(markedNumbers as Set<number>)
                                    .sort((a, b) => a - b)
                                    .map((num: number) => (
                                        <View key={num} style={styles.markedNumber}>
                                            <Text style={styles.markedNumberText}>{num}</Text>
                                        </View>
                                    ))}
                            </View>
                        </View>

                        {/* Validation Status */}
                        <View
                            style={[
                                styles.validationBadge,
                                isValid ? styles.validBadge : styles.invalidBadge,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.validationText,
                                    isValid ? styles.validText : styles.invalidText,
                                ]}
                            >
                                {isValid
                                    ? '✓ Valid claim - Pattern matches!'
                                    : '✗ Invalid claim - Pattern does not match'}
                            </Text>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={onReject}
                                style={styles.rejectButton}
                            >
                                <LinearGradient
                                    colors={['#EF4444', '#EC4899']}
                                    style={styles.buttonGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <Icon name="x" size={20} color="#fff" />
                                    <Text style={styles.buttonText}>Reject</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={onApprove}
                                disabled={!isValid}
                                style={[styles.approveButton, !isValid && styles.disabledButton]}
                            >
                                <LinearGradient
                                    colors={['#10B981', '#059669']}
                                    style={styles.buttonGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <Icon name="check" size={20} color="#fff" />
                                    <Text style={styles.buttonText}>Approve</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        {/* Quick Actions */}
                        <View style={styles.quickActions}>
                            <TouchableOpacity style={styles.quickActionButton}>
                                <Text style={styles.quickActionText}>View Full Ticket</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.quickActionButton}>
                                <Text style={styles.quickActionText}>Call History</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    container: {
        backgroundColor: '#fff',
        borderRadius: 24,
        width: '100%',
        maxWidth: 448,
        maxHeight: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.25,
        shadowRadius: 25,
        elevation: 10,
    },
    scrollContent: {
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    iconBadge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
    },
    ticketContainer: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
    },
    ticketTitle: {
        fontSize: 16,
        color: '#374151',
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '600',
    },
    ticketGrid: {
        gap: 4,
    },
    ticketRow: {
        flexDirection: 'row',
        gap: 4,
    },
    cell: {
        flex: 1,
        aspectRatio: 1,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    markedCell: {
        backgroundColor: '#10B981',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    unmarkedCell: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    emptyCell: {
        flex: 1,
        aspectRatio: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 8,
    },
    cellText: {
        fontSize: 12,
        color: '#374151',
        fontWeight: '600',
    },
    markedSection: {
        marginBottom: 24,
    },
    markedTitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 8,
    },
    markedGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
    },
    markedNumber: {
        width: 32,
        height: 32,
        backgroundColor: '#D1FAE5',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    markedNumberText: {
        fontSize: 14,
        color: '#059669',
        fontWeight: '600',
    },
    validationBadge: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 2,
    },
    validBadge: {
        backgroundColor: '#ECFDF5',
        borderColor: '#A7F3D0',
    },
    invalidBadge: {
        backgroundColor: '#FEF2F2',
        borderColor: '#FECACA',
    },
    validationText: {
        textAlign: 'center',
        fontWeight: '600',
    },
    validText: {
        color: '#047857',
    },
    invalidText: {
        color: '#DC2626',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    rejectButton: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    approveButton: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    disabledButton: {
        opacity: 0.5,
    },
    buttonGradient: {
        flexDirection: 'row',
        paddingVertical: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    quickActions: {
        flexDirection: 'row',
        gap: 8,
    },
    quickActionButton: {
        flex: 1,
        paddingVertical: 8,
    },
    quickActionText: {
        color: '#6B7280',
        fontSize: 14,
        textAlign: 'center',
    },
});