import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Image, Modal } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

import { logo } from '@/constants/VisualAssets';
import CustomButton from '@/components/shared/CustomButton';
import MapInputField from '@/components/map/MapInputField';

const { width, height } = Dimensions.get('window');

const markers = [
  { id: 1, latitude: 41.044248, longitude: 29.007288, color: 'red' },
  { id: 2, latitude: 41.064, longitude: 29.009, color: 'blue' },
  { id: 3, latitude: 41.044, longitude: 29.00, color: 'green' },
];


const Home = () => {
  const [showCreateMarketModal, setShowCreateMarketModal] = useState(false);
  const [toggleVoronoi, setToggleVoronoi] = useState(false);
  const [position, setPosition] = useState({ latitude: 41.044, longitude: 29.008 });

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setPosition(coordinate);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        onPress={handleMapPress}
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
            style={styles.marker}
          >
            <Image
              source={logo}
              style={styles.markerImage}
            />
          </Marker>
        ))}

        { /* user location */}
        {position && (
          <Marker
            pinColor='black'
            coordinate={{
              latitude: position.latitude,
              longitude: position.longitude,
            }}
          >
          </Marker>
        )}
      </MapView>

      {/* floating button */}
      <View style={styles.addMarketButtonContainer}>
        <CustomButton
          text="Add Market"
          onPress={() => {
            // open a modal
            setShowCreateMarketModal(true);
          }}
          style={styles.addMarketButton}
          textStyle={{ fontSize: 12 }}
        />
      </View>

      {/* floating button */}
      <View style={styles.toggleVoronoiButtonContainer}>
        <CustomButton
          text="Toggle Voronoi"
          onPress={() => {
            // open a modal
            setToggleVoronoi(!toggleVoronoi);
          }}
          style={styles.addMarketButton}
          textStyle={{ fontSize: 12 }}
        />
      </View>

      {/* modal */}
      {showCreateMarketModal && (
        <Modal
          style={styles.modalContainer}
          animationType="fade"
          transparent={true}
        >
          <View style={styles.modal}>

            <MapInputField
              label="Name"
              placeholder="Market Name"
              otherStyles={styles.inputField}
            />

            <View style={styles.modalButtonsContainer}>
              <CustomButton
                text="Close"
                onPress={() => {
                  // close the modal
                  setShowCreateMarketModal(false);
                }}
              />

              <CustomButton
                text="Add"
                onPress={() => {
                  // close the modal
                  setShowCreateMarketModal(false);
                }}
              />
            </View>

          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    opacity: 0.8,
    width: width,
    height: height,
  },
  marker: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  markerImage: {
    width: 20,
    height: 20,
    tintColor: "rgba(255, 255, 255, 0.7)",
    alignSelf: 'center',
  },
  addMarketButtonContainer: {
    position: 'absolute',
    zIndex: 5,
    bottom: 20,
    right: 20,
  },
  addMarketButton: {
    height: 40,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleVoronoiButtonContainer: {
    position: 'absolute',
    zIndex: 5,
    bottom: 20,
    left: 20,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    position: 'absolute',
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.97)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  inputField: {
    width: '100%',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 20,
    width: '100%',
  },
});

export default Home;