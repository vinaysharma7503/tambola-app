import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  AccessibilityRole,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type OnboardingProps = {
  onComplete: () => void;
};

const { width: SCREEN_W } = Dimensions.get('window');

const slides = [
  {
    title: 'Digital Tambola Tickets',
    description: 'Get auto-generated tickets and mark numbers with a tap. No paper needed!',
    colors: ['#8B5CF6', '#EC4899'], // purple -> pink
    emoji: '🎫',
  },
  {
    title: 'Play with Anyone',
    description: 'Host games or join using a code. Play with family and friends anywhere!',
    colors: ['#EC4899', '#FB923C'], // pink -> orange
    emoji: '👥',
  },
  {
    title: 'Exciting Prizes',
    description: 'Multiple winning patterns: Early 5, Top Line, Full House, and more!',
    colors: ['#FB923C', '#F59E0B'], // orange -> yellow
    emoji: '🏆',
  },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // animated offset (we slide the entire list horizontally)
  const translateX = useRef(new Animated.Value(0)).current;

  // entrance animation for icon (scale)
  const iconScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // animate translateX to the current slide
    Animated.timing(translateX, {
      toValue: -currentSlide * SCREEN_W,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // icon pop animation (restart on slide change)
    iconScale.setValue(0);
    Animated.spring(iconScale, {
      toValue: 1,
      friction: 8,
      tension: 120,
      useNativeDriver: true,
    }).start();
  }, [currentSlide, translateX, iconScale]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((s) => s + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <LinearGradient colors={['#FBF7FF', '#FFF7F4', '#FFF1EB']} style={styles.container}>
      <View style={styles.inner}>
        {/* Top: Skip */}
        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={handleSkip}
            accessibilityRole={'button' as AccessibilityRole}
            accessibilityLabel="Skip Onboarding"
            style={styles.skipBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Slides wrapper */}
        <View style={styles.slidesViewport}>
          <Animated.View
            style={[
              styles.slidesRow,
              { width: SCREEN_W * slides.length, transform: [{ translateX }] },
            ]}
          >
            {slides.map((slide, idx) => (
              <View key={idx} style={[styles.slide, { width: SCREEN_W }]}>
                <Animated.View
                  style={[
                    styles.iconWrap,
                    {
                      transform: [{ scale: iconScale }],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={slide.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.iconCircle}
                  >
                    <Text style={styles.iconEmoji}>{slide.emoji}</Text>
                  </LinearGradient>
                </Animated.View>

                <Text style={styles.slideTitle}>{slide.title}</Text>
                <Text style={styles.slideDescription}>{slide.description}</Text>
              </View>
            ))}
          </Animated.View>
        </View>

        {/* Pagination */}
        <View style={styles.pagination}>
          {slides.map((_, index) => {
            const isActive = index === currentSlide;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => goToSlide(index)}
                style={[
                  styles.dot,
                  isActive ? styles.dotActive : styles.dotInactive,
                ]}
                activeOpacity={0.8}
                accessibilityRole={'button' as AccessibilityRole}
                accessibilityLabel={`Go to slide ${index + 1}`}
              />
            );
          })}
        </View>

        {/* Next button */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.9}
            style={styles.nextBtnContainer}
            accessibilityRole={'button' as AccessibilityRole}
            accessibilityLabel={currentSlide < slides.length - 1 ? 'Next' : 'Get Started'}
          >
            <LinearGradient
              colors={['#8B5CF6', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextBtn}
            >
              <Text style={styles.nextText}>
                {currentSlide < slides.length - 1 ? 'Next' : 'Get Started'}
              </Text>

              {/* right arrow: using simple text arrow if vector icons aren't available */}
              <Text style={styles.nextArrow}>➜</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
    paddingTop: Platform.select({ ios: 56, android: 36, default: 36 }),
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  skipBtn: {
    padding: 8,
  },
  skipText: {
    color: '#6B7280',
    fontSize: 15,
  },

  slidesViewport: {
    flex: 1,
    overflow: 'hidden',
    justifyContent: 'center',
  },

  slidesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  slide: {
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconWrap: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 140 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },

  iconEmoji: {
    fontSize: 48,
  },

  slideTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },

  slideDescription: {
    color: '#6B7280',
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 18,
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    gap: 8,
  },

  dot: {
    height: 8,
    borderRadius: 8,
    marginHorizontal: 6,
  },

  dotActive: {
    width: 36,
    backgroundColor: undefined, // we will render gradient via nextBtn rather than here
    // draw gradient effect by overlay - for simplicity, use solid color:
    backgroundColor: '#8B5CF6',
  },

  dotInactive: {
    width: 8,
    backgroundColor: '#E5E7EB',
  },

  footer: {
    marginTop: 18,
  },

  nextBtnContainer: {
    width: '100%',
  },

  nextBtn: {
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  nextText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  nextArrow: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
});
