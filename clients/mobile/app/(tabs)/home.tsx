import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Image, Modal } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

// constants
import { logo } from '@/constants/VisualAssets';

// components
import CustomButton from '@/components/shared/CustomButton';
import MapInputField from '@/components/map/MapInputField';

// stores
import { useMarketStore } from '@/stores/MarketStores';


const { width, height } = Dimensions.get('window');

const Home = () => {
  const [showCreateMarketModal, setShowCreateMarketModal] = useState(false);
  const [toggleVoronoi, setToggleVoronoi] = useState(false);
  const [position, setPosition] = useState({ latitude: 41.044, longitude: 29.008 });

  const fetchMarkets = useMarketStore(state => state.fetchMarkets);
  const markets = useMarketStore(state => state.markets);


  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r},${g},${b},1)`;
  }


  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setPosition(coordinate);
  };


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
          pitch: 40,
          heading: 0,
          altitude: 500,
          zoom: 0,
        }}
        mapType='mutedStandard'
        provider={PROVIDER_DEFAULT}
      >

        {/* market locations */}
        {markets.map((market, index) => (
          <Marker
            key={index}
            pinColor='red'
            icon={0}
            coordinate={{
              latitude: market.latitude,
              longitude: market.longitude,
            }}
          />
        ))}

        { /* user location */}
        {position && (
          <Marker
            pinColor='black'
            icon={0}
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
    width: width,
    height: height,
  },
  marker: {
    width: 10,
    height: 9,
    borderRadius: 100,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderColor: 'black',
    borderWidth: .2,
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