
import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { IconSymbol } from "@/components/IconSymbol";
import { HapticFeedback } from "@/utils/haptics";

export default function AddScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [isRecording, setIsRecording] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    console.log('AddScreen mounted');
    // Request camera permission on mount
    if (!permission?.granted) {
      console.log('Requesting camera permission');
      requestPermission();
    }
  }, []);

  const startRecording = async () => {
    if (!cameraRef.current) {
      console.log('Camera ref not available');
      return;
    }

    try {
      console.log('Starting video recording...');
      HapticFeedback.medium();
      setIsRecording(true);
      const video = await cameraRef.current.recordAsync();
      console.log('Video recorded:', video);
      
      if (video && video.uri) {
        HapticFeedback.success();
        Alert.alert('Success', `Video saved to: ${video.uri}`);
      }
    } catch (error) {
      console.error('Error recording video:', error);
      HapticFeedback.error();
      Alert.alert('Error', 'Failed to record video');
    } finally {
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      console.log('Stopping video recording...');
      HapticFeedback.light();
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  const toggleCameraFacing = () => {
    HapticFeedback.light();
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const handlePermissionRequest = () => {
    HapticFeedback.medium();
    requestPermission();
  };

  if (!permission) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: '#F5F1ED' }]} edges={['top']}>
        <View style={styles.container}>
          <Text style={styles.title}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: '#F5F1ED' }]} edges={['top']}>
        <View style={styles.container}>
          <Text style={styles.title}>Camera Permission Required</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={handlePermissionRequest}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#000000' }]} edges={['top']}>
      <View style={styles.container}>
        <CameraView 
          ref={cameraRef}
          style={styles.camera} 
          facing={facing}
          mode="video"
        >
          <View style={styles.controlsContainer}>
            <TouchableOpacity 
              style={styles.flipButton} 
              onPress={toggleCameraFacing}
            >
              <IconSymbol 
                ios_icon_name="arrow.triangle.2.circlepath.camera" 
                android_material_icon_name="flip-camera-android" 
                size={32} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.recordButton, isRecording && styles.recordButtonActive]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <View style={[styles.recordButtonInner, isRecording && styles.recordButtonInnerActive]} />
            </TouchableOpacity>

            <View style={styles.placeholder} />
          </View>
        </CameraView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 48 : 0,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2E2A8B',
    textAlign: 'center',
    marginTop: 100,
  },
  permissionButton: {
    backgroundColor: '#2E2A8B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 20,
    alignSelf: 'center',
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  recordButtonActive: {
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF0000',
  },
  recordButtonInnerActive: {
    borderRadius: 8,
    width: 40,
    height: 40,
  },
  placeholder: {
    width: 50,
    height: 50,
  },
});
