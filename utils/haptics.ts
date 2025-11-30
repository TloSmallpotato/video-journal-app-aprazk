
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Haptic feedback utility class
 * Provides consistent haptic feedback across the app
 * Note: Haptics work on both iOS and Android, but are more refined on iOS
 */
export class HapticFeedback {
  /**
   * Light impact - for subtle interactions like taps
   */
  static light() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  /**
   * Medium impact - for standard button presses
   */
  static medium() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  /**
   * Heavy impact - for important actions
   */
  static heavy() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }

  /**
   * Soft impact - for gentle interactions
   */
  static soft() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
  }

  /**
   * Rigid impact - for precise interactions
   */
  static rigid() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
  }

  /**
   * Selection feedback - for picker/selector changes
   */
  static selection() {
    Haptics.selectionAsync();
  }

  /**
   * Success notification - for successful operations
   */
  static success() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  /**
   * Error notification - for failed operations
   */
  static error() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }

  /**
   * Warning notification - for warning messages
   */
  static warning() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }
}
