import React from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

import { logo } from '@/constants/VisualAssets';

const { width, height } = Dimensions.get('window');

const markers = [
  { id: 1, latitude: 41.044, longitude: 29.008, color: 'red' },
  { id: 2, latitude: 41.064, longitude: 29.009, color: 'blue' },
  { id: 3, latitude: 41.044, longitude: 29.00, color: 'green' },
];

const App = () => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 41.044,
          longitude: 29.008,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        provider={PROVIDER_DEFAULT}
      >
        {markers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            focusable={true}
            title="Title"
            description="Description"
            image={logo}

          >
            {/* <Image source={logo} style={{ width: 40, height: 40 }} /> */}
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: width,
    height: height,
  },
});

export default App;