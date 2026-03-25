import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface DashboardProps {
  navigation?: any;
}

const recentGames = [
  { id: 1, name: 'Family Fun Night', date: '2 hours ago', winners: 3, players: 8 },
  { id: 2, name: 'Weekend Kitty Party', date: 'Yesterday', winners: 5, players: 12 },
  { id: 3, name: 'Office Celebration', date: '3 days ago', winners: 4, players: 15 },
];

const stats = [
  { icon: 'trophy-outline', label: 'Games Won', value: '24', colors: ['#FACC15', '#F97316'] },
  { icon: 'ticket-outline', label: 'Total Games', value: '87', colors: ['#C084FC', '#EC4899'] },
  { icon: 'people-outline', label: 'Friends', value: '156', colors: ['#60A5FA', '#22D3EE'] },
];

export function Dashboard({ navigation }: DashboardProps) {
  const handleCreateGame = () => {
    navigation?.navigate('CreateGame');
  };

  const handleJoinGame = () => {
    navigation?.navigate('JoinGame');
  };

  const handleProfile = () => {
    navigation?.navigate('Profile');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <LinearGradient colors={['#7C3AED', '#EC4899']} style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable style={styles.avatar} onPress={handleProfile}>
            <Ionicons name="person-outline" size={22} color="#fff" />
          </Pressable>

          <View>
            <Text style={styles.welcome}>Welcome back,</Text>
            <Text style={styles.username}>Priya Sharma 👋</Text>
          </View>

          <View style={styles.settings}>
            <Ionicons name="settings-outline" size={20} color="#fff" />
          </View>
        </View>

        {/* STATS */}
        <View style={styles.statsRow}>
          {stats.map((stat, i) => (
            <Animated.View
              key={stat.label}
              entering={FadeInDown.delay(i * 100)}
              style={styles.statCard}
            >
              <LinearGradient colors={stat.colors} style={styles.statIcon}>
                <Ionicons name={stat.icon} size={18} color="#fff" />
              </LinearGradient>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Animated.View>
          ))}
        </View>
      </LinearGradient>

      {/* BODY */}
      <View style={styles.body}>
        {/* QUICK ACTIONS */}
        <View style={styles.actionsRow}>
          <ActionCard
            title="Start Game"
            subtitle="Host a new game"
            colors={['#8B5CF6', '#EC4899']}
            icon="add"
            onPress={handleCreateGame}
          />

          <ActionCard
            title="Join Game"
            subtitle="Enter game code"
            colors={['#F97316', '#FACC15']}
            icon="log-in-outline"
            onPress={handleJoinGame}
          />
        </View>

        {/* MY TICKETS */}
        <Card title="My Tickets" action="View All">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2, 3].map((t) => (
              <View key={t} style={styles.ticket}>
                <View style={styles.ticketRow}>
                  <Ionicons name="ticket-outline" size={14} color="#7C3AED" />
                  <Text style={styles.ticketId}>#{t}234</Text>
                </View>
                <Text style={styles.ticketGame}>Game #{t}05</Text>
              </View>
            ))}
          </ScrollView>
        </Card>

        {/* RECENT GAMES */}
        <Card
          title="Recent Games"
          icon={<Ionicons name="time-outline" size={18} color="#7C3AED" />}
        >
          {recentGames.map((game) => (
            <View key={game.id} style={styles.gameRow}>
              <View>
                <Text style={styles.gameName}>{game.name}</Text>
                <Text style={styles.gameMeta}>
                  {game.date} • {game.players} players
                </Text>
              </View>
              <View style={styles.winners}>
                <Ionicons name="trophy-outline" size={14} color="#CA8A04" />
                <Text style={styles.winnerCount}>{game.winners}</Text>
              </View>
            </View>
          ))}
        </Card>
      </View>
    </ScrollView>
  );
}

/* ================= COMPONENTS ================= */

function ActionCard({ title, subtitle, colors, icon, onPress }: any) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.actionCard, animatedStyle]}>
      <Pressable
        onPressIn={() => (scale.value = withSpring(0.96))}
        onPressOut={() => (scale.value = withSpring(1))}
        onPress={onPress}
      >
        <LinearGradient colors={colors} style={styles.actionIcon}>
          <Ionicons name={icon} size={28} color="#fff" />
        </LinearGradient>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </Pressable>
    </Animated.View>
  );
}

function Card({ title, action, icon, children }: any) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          {icon}
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        {action && <Text style={styles.cardAction}>{action}</Text>}
      </View>
      {children}
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF5FF' },

  header: {
    padding: 24,
    paddingBottom: 80,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settings: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcome: { color: 'rgba(255,255,255,0.8)' },
  username: { color: '#fff', fontWeight: '600' },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: {
    width: '30%',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: { color: '#fff', fontSize: 18 },
  statLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },

  body: { padding: 20, marginTop: -50 },
  actionsRow: { flexDirection: 'row', gap: 16, marginBottom: 24 },

  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    alignSelf: 'center',
  },
  actionTitle: { fontWeight: '600', textAlign: 'center', color: '#1F2937' },
  actionSubtitle: { fontSize: 12, textAlign: 'center', color: '#6B7280' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardTitle: { fontWeight: '600', color: '#1F2937' },
  cardAction: { color: '#7C3AED' },

  ticket: {
    width: 120,
    height: 80,
    backgroundColor: '#F5F3FF',
    borderRadius: 14,
    padding: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  ticketRow: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  ticketId: { fontSize: 12, color: '#7C3AED' },
  ticketGame: { fontSize: 12, color: '#4C1D95' },

  gameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  gameName: { fontWeight: '500', color: '#1F2937' },
  gameMeta: { fontSize: 12, color: '#6B7280' },

  winners: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  winnerCount: { color: '#CA8A04' },
});
