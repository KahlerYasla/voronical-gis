import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableOpacity, Text, Animated, Image } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Animatable from 'react-native-animatable';

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
  const fetchMarkets = useMarketStore(state => state.fetchMarkets);
  const markets = useMarketStore(state => state.markets);


  // const getRandomColor = () => {
  //   const r = Math.floor(Math.random() * 256);
  //   const g = Math.floor(Math.random() * 20);
  //   const b = Math.floor(Math.random() * 0);
  //   return `rgba(${r},${g},${b},1)`;
  // }


  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setPosition(coordinate);
  };


  const toggleButtons = () => {
    setShowButtons(!showButtons);
  };


  const buttonData = [
    { text: 'Go to My Location', onPress: () => console.log('My Location') },
    { text: 'Toggle Voronoi', onPress: () => setToggleVoronoi(!toggleVoronoi) },
    { text: 'Add Market to the Star Point', onPress: () => setShowCreateMarketModal(true) },
    { text: 'Navigate Nearest Market', onPress: () => console.log('Navigate Nearest Market') },
    { text: 'Navigate Selected Market', onPress: () => console.log('Navigate Selected Market') },
  ];


  useEffect(() => {
    fetchMarkets().then(() => {
      console.log('Markets fetched');
    }
    );
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
            <Text style={styles.marketPin}>▼</Text>
          </Marker>
        )}
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
    backgroundColor: 'black',
    flex: 1,
    width: '100%',
    height: '100%',
  },
  locationMarkerContainer: {
    marginBottom: 0,
    padding: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5,
  },
  marketMarkerContainer: {
    marginBottom: -5,
    width: 'auto',
    paddingHorizontal: 6,
    height: 15,
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
    marginTop: -5,
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
    backgroundColor: 'rgba(0, 0, 0, 1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    position: 'absolute',
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