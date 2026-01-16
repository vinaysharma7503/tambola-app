import React, { useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import RNBootSplash from 'react-native-bootsplash';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const CONFETTI_COUNT = 20;

export default function Splash({onFinish}: {onFinish: () => void}) {

     useEffect(() => {
    RNBootSplash.hide({fade: true});
    setTimeout(() => {
        onFinish();
    }, 300);
  }, []);
  // Confetti metadata (randomized once)
  const confetti = useMemo(() => {
    return Array.from({ length: CONFETTI_COUNT }).map(() => ({
      left: Math.random() * (SCREEN_W - 8),
      top: Math.random() * (SCREEN_H - 8),
      color: ["#FFD700", "#FF69B4", "#00CED1", "#FF6347"][
        Math.floor(Math.random() * 4)
      ],
      duration: 2000 + Math.random() * 2000,
      delay: Math.random() * 2000,
      rotateDuration: 2000 + Math.random() * 2000,
      scaleDuration: 2000 + Math.random() * 2000,
    }));
  }, []);

  // Animated values for confetti
  const confettiAnim = useRef(
    confetti.map(() => ({
      y: new Animated.Value(0),
      rotate: new Animated.Value(0),
      scale: new Animated.Value(1),
    }))
  ).current;

  // Central emblem animation (scale + rotate)
  const emblemScale = useRef(new Animated.Value(0)).current;
  const emblemRotate = useRef(new Animated.Value(-180)).current; // degrees

  // Sparkles (rotating behind emblem)
  const sparklesRotate = useRef(new Animated.Value(0)).current;

  // Title and subtitle fade/translate
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;

  // Pulsing dots
  const dotAnims = useRef([new Animated.Value(0.3), new Animated.Value(0.3), new Animated.Value(0.3)]).current;

  useEffect(() => {
    // Start confetti animations
    confettiAnim.forEach((anim, i) => {
      const cfg = confetti[i];
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim.y, {
            toValue: -20,
            duration: cfg.duration / 2,
            delay: cfg.delay,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.quad),
          }),
          Animated.timing(anim.y, {
            toValue: 0,
            duration: cfg.duration / 2,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.quad),
          }),
        ])
      ).start();

      Animated.loop(
        Animated.timing(anim.rotate, {
          toValue: 1, // will map to 360deg in interpolation
          duration: cfg.rotateDuration,
          useNativeDriver: true,
          easing: Easing.linear,
        })
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(anim.scale, {
            toValue: 1.5,
            duration: cfg.scaleDuration / 2,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.quad),
          }),
          Animated.timing(anim.scale, {
            toValue: 1,
            duration: cfg.scaleDuration / 2,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.quad),
          }),
        ])
      ).start();
    });

    // Emblem entrance (spring-like)
    Animated.parallel([
      Animated.spring(emblemScale, {
        toValue: 1,
        friction: 6,
        tension: 160,
        useNativeDriver: true,
      }),
      Animated.timing(emblemRotate, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    // Sparkles perpetual rotation
    Animated.loop(
      Animated.timing(sparklesRotate, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Title & subtitle reveal
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(titleY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(subtitleOpacity, {
        toValue: 0.9,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulsing dots
    dotAnims.forEach((val, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, {
            toValue: 1,
            duration: 750,
            delay: i * 200,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.quad),
          }),
          Animated.timing(val, {
            toValue: 0.3,
            duration: 750,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.quad),
          }),
        ])
      ).start();
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Interpolations helpers
  const rotateInterpolate = (val:any) =>
    val.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });

  return (
    <LinearGradient
      colors={["#6B21A8", "#EC4899", "#FB923C"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Floating confetti */}
      {confetti.map((c, i) => {
        const anim = confettiAnim[i];
        const rotate = rotateInterpolate(anim.rotate);
        return (
          <Animated.View
            key={i}
            style={[
              styles.confetti,
              {
                backgroundColor: c.color,
                left: c.left,
                top: c.top,
                transform: [
                  { translateY: anim.y },
                  { rotate },
                  { scale: anim.scale },
                ],
              },
            ]}
          />
        );
      })}

      <View style={styles.centerWrap}>
        <Animated.View
          style={[
            styles.emblemWrap,
            {
              zIndex: 10,
              transform: [
                { scale: emblemScale },
                {
                  rotate: emblemRotate.interpolate({
                    inputRange: [-180, 0],
                    outputRange: ["-180deg", "0deg"],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.relative}>
            <Animated.View
              style={[
                styles.sparkles,
                {
                  transform: [
                    {
                      rotate: sparklesRotate.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                  ],
                },
              ]}
            >
              {/* using emoji for sparkle — replace with an SVG if desired */}
              <Text style={styles.sparklesEmoji}>✨</Text>
            </Animated.View>

            <View style={styles.ballContainer}>
              <Text style={styles.ballEmoji}>🎱</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.Text
          style={[
            styles.title,
            {
              opacity: titleOpacity,
              transform: [{ translateY: titleY }],
            },
          ]}
        >
          Tambola Party
        </Animated.Text>

        <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
          Play Housie with Friends & Family
        </Animated.Text>

        <View style={styles.dotsRow}>
          {dotAnims.map((a, idx) => (
            <Animated.View
              key={idx}
              style={[
                styles.dot,
                {
                  opacity: a,
                },
              ]}
            />
          ))}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  confetti: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 1,
  },
  centerWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    paddingHorizontal: 20,
  },
  emblemWrap: {
    marginBottom: 24,
  },
  relative: {
    alignItems: "center",
    justifyContent: "center",
  },
  sparkles: {
    position: "absolute",
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
  },
  sparklesEmoji: {
    fontSize: 48,
    // slight opacity to mimic text-yellow-300 from original
    opacity: 0.9,
  },
  ballContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 999,
    elevation: 10,
    // shadow for iOS
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  ballEmoji: {
    fontSize: 48,
    textAlign: "center",
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 8,
  },
  subtitle: {
    color: "rgba(255,255,255,0.9)",
    marginTop: 6,
  },
  dotsRow: {
    marginTop: 24,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    marginHorizontal: 6,
  },
});
