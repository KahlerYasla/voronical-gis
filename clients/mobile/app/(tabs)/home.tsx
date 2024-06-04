import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text, Image } from 'react-native';

import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Animatable from 'react-native-animatable';
import GetLocation from 'react-native-get-location';

// constants
import { logo, starIcon } from '@/constants/VisualAssets';

// components
import CustomButton from '@/components/shared/CustomButton';
import MapInputField from '@/components/map/MapInputField';

// stores
import { useMarketStore } from '@/stores/MarketStores';
import CustomText from '@/components/shared/CustomText';

const Home = () => {
  const [showCreateMarketModal, setShowCreateMarketModal] = useState(false);
  const [toggleVoronoi, setToggleVoronoi] = useState(false);
  const [position, setPosition] = useState({ latitude: 41.044, longitude: 29.008 });
  const [showButtons, setShowButtons] = useState(false);
  const [name, setName] = useState('');

  // stores
  const markets = useMarketStore(state => state.markets);
  const fetchMarkets = useMarketStore(state => state.fetchMarkets);
  const createMarket = useMarketStore(state => state.createMarket);


  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setPosition(coordinate);
  };


  const getMyLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        setPosition(location);
      })
      .catch(error => {
        const { code, message } = error;
        // console.warn(code, message);
      });
  }


  const toggleButtons = () => {
    setShowButtons(!showButtons);
  };


  const buttonData = [
    { text: 'Go to My Location', onPress: () => console.log('My Location') },
    { text: 'Toggle Voronoi', onPress: () => setToggleVoronoi(!toggleVoronoi) },
    {
      text: 'Create Market at Star Point', onPress: () => {
        setShowCreateMarketModal(true);
        setShowButtons(false);
      }
    },
    { text: 'Navigate Nearest Market', onPress: () => console.log('Navigate Nearest Market') },
    { text: 'Navigate Selected Market', onPress: () => console.log('Navigate Selected Market') },
  ];


  useEffect(() => {
    fetchMarkets().then(() => {
      console.log('Markets fetched');
    }
    );
  }, []);


  useEffect(() => {
    getMyLocation();
  }, []);


  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}

        onPress={handleMapPress}
        camera={{
          center: {
            latitude: 41.044,
            longitude: 29.008,
          },
          pitch: 60,
          heading: 0,
          altitude: 500,
          zoom: 0,
        }}
        loadingEnabled={true}
        loadingIndicatorColor="red"
        maxDelta={0.01}
        mapType='mutedStandard'

        rotateEnabled={false}
        zoomEnabled={false}
        provider={PROVIDER_DEFAULT}
      >

        {/* market locations */}
        {markets.map((market, index) => (
          <Marker
            key={index}
            style={styles.markerContainer}
            coordinate={{
              latitude: market.latitude,
              longitude: market.longitude,
            }}
          >
            <View style={styles.marketMarkerContainer}>
              <CustomText children={market.name} style={{ fontSize: 10, color: "white" }} />
            </View>
            <Text style={styles.marketPin}>▼</Text>
          </Marker>
        ))}

        { /* user location */}
        {position && (
          <Marker
            pinColor='black'
            style={styles.markerContainer}
            coordinate={{
              latitude: position.latitude,
              longitude: position.longitude,
            }}
          >
            <View style={styles.locationMarkerContainer}>
              <Image
                source={starIcon}
                style={{ width: 15, height: 15 }}
              />
            </View>
          </Marker>
        )}

        {/* navigation */}
        <Polyline
          coordinates={[
            { latitude: 41.044, longitude: 29.008 },
            { latitude: 41.040, longitude: 29.004 },
            { latitude: 41.038, longitude: 29.006 },
            { latitude: 41.036, longitude: 29.008 },
            { latitude: 41.034, longitude: 29.010 },
          ]}
          strokeColor="black" // fallback for when `strokeColors` is not supported by the map-provider
          strokeWidth={3}
        />

      </MapView>

      {/* Floating buttons */}
      <View style={styles.floatingButtonContainer}>
        {showButtons && buttonData.map((button, index) => (
          <Animatable.View
            key={index}
            animation="fadeInUp"
            duration={1000}
            style={styles.animatedButton}
          >
            <CustomButton
              text={button.text}
              onPress={button.onPress}
              style={styles.floatingButton}
              textStyle={{ fontSize: 12 }}
            />
          </Animatable.View>
        ))}

        <TouchableOpacity onPress={toggleButtons} style={styles.hamburgerButton}>
          <Text style={styles.hamburgerText}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* modal */}
      {showCreateMarketModal && (
        <Modal
          animationType="fade"
          transparent={true}
        >
          <View style={styles.modal}>

            <MapInputField
              label="Name"
              placeholder="Market Name"
              otherStyles={styles.inputField}
              value={name}
              onChangeText={setName}
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
                  createMarket({ name: name, geom: `${position.latitude},${position.longitude}` }).then(() => {
                    setShowCreateMarketModal(false);
                    fetchMarkets();
                  });
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
    backgroundColor: 'black',
    flex: 1,
    width: '100%',
    height: '100%',
  },
  markerContainer: {
  },
  locationMarkerContainer: {
    padding: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  marketMarkerContainer: {
    width: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5,
  },
  marketPin: {
    marginTop: 0,
    color: 'rgba(0, 0, 0, 0.7)',
    textAlign: 'center',
    fontSize: 16,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'flex-end',
  },
  hamburgerButton: {
    backgroundColor: 'rgba(0, 0, 0, 1)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  hamburgerText: {
    color: 'white',
    fontSize: 24,
  },
  animatedButton: {
    marginBottom: 10,
  },
  floatingButton: {
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, .7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.90)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
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