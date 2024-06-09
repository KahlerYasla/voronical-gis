import { useEffect, useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text, Image } from 'react-native';

import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Animatable from 'react-native-animatable';

// constants
import { logo, starIcon } from '@/constants/VisualAssets';

// components
import CustomButton from '@/components/shared/CustomButton';
import MapInputField from '@/components/home/map/MapInputField';
import ListingModal from '@/components/home/modals/ListingModal';
import CustomText from '@/components/shared/CustomText';

// stores
import { useMarketStore } from '@/stores/MarketStore';
import { useNavigationStore } from '@/stores/NavigationStore';
import { useAuthStore } from '@/stores/AuthStore';

const Home = () => {
  // states show/hide
  const [showCreateMarketModal, setShowCreateMarketModal] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [toggleVoronoi, setToggleVoronoi] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);

  // states data
  const [position, setPosition] = useState({ latitude: 41.044, longitude: 29.008 });
  const [name, setName] = useState('');

  // stores
  const markets = useMarketStore(state => state.markets);
  const fetchMarkets = useMarketStore(state => state.fetchMarkets);
  const createMarket = useMarketStore(state => state.createMarket);

  const lineString = useNavigationStore(state => state.lineString);
  const navigateToMarket = useNavigationStore(state => state.navigateToMarket);
  const navigateToNearestMarket = useNavigationStore(state => state.navigateToNearestMarket);

  const voroniPolygon = useNavigationStore(state => state.voronoiPolygon);
  const fetchVoronoiPolygon = useNavigationStore(state => state.fetchVoronoiPolygon);

  const authCredentials = useAuthStore(state => state.credentials);

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setPosition(coordinate);
  };

  const toggleButtons = () => {
    setShowButtons(!showButtons);
  };

  const getColorWithinTheRange = (voronoicalValue: number) => {
    if (voronoicalValue < 2.5) {
      return "rgba(255, 0, 0, 1)";
    } else if (voronoicalValue >= 2.5 && voronoicalValue < 5) {
      return "rgba(255, 165, 0, 1)";
    } else if (voronoicalValue >= 5 && voronoicalValue < 7.5) {
      return "rgba(255, 255, 0, 1)";
    } else {
      return "rgba(0, 255, 0, 1)";
    }
  }

  const buttonData = [
    {
      userRole: "marketer",
      text: 'Toggle Voronoi',
      onPress: () => {
        console.log('Toggle Voronoi');
        fetchVoronoiPolygon();
        setToggleVoronoi(!toggleVoronoi)
      }
    },
    {
      userRole: "marketer",
      text: 'List Markets & Insights',
      onPress: () => {
        setShowListingModal(true);
        setShowButtons(false);
      }
    },
    {
      userRole: "marketer",
      text: 'Which area should I open a new market?',
      onPress: () => {
        console.log('Open Market Area');
        setShowButtons(false);
      }
    },
    {
      userRole: "marketer",
      text: 'Which area should I close a market?',
      onPress: () => {
        console.log('Close Market Area');
        setShowButtons(false);
      }
    },
    {
      userRole: "marketer",
      text: 'Create Market at Star Point',
      onPress: () => {
        setShowCreateMarketModal(true);
        setShowButtons(false);
      }
    },
    {
      userRole: "user",
      text: 'Navigate from Star to Nearest Market',
      onPress: async () => {
        console.log('Navigate Nearest Market');

        navigateToNearestMarket({
          start: `${position.latitude} ${position.longitude}`,
          end: null,
        });

        setShowButtons(false);
      }
    },
    {
      userRole: "user",
      text: 'Navigate from Star to Selected Market',
      onPress: () => {

      }
    },
  ];

  useEffect(() => {
    fetchMarkets().then(() => {
      console.log('Markets fetched');
    });
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
              <CustomText children={market.name} style={{
                fontSize: 10,
                color: "white"
              }} />
            </View>
            {toggleVoronoi && (
              <Text style={{
                backgroundColor: "black",
                color: getColorWithinTheRange(market.voronoiScore),
                fontSize: 12,
                alignSelf: 'center',
                paddingHorizontal: 20,
              }}>{market.voronoiScore.toFixed(2)}</Text>
            )}
            <Text style={styles.marketPin}>▼</Text>
          </Marker>
        ))}

        {/* user location */}
        {position && (
          <Marker
            style={styles.markerContainer}
            coordinate={{
              latitude: position.latitude,
              longitude: position.longitude,
            }}
          >
            <View style={styles.locationMarkerContainer}>
              <Image
                source={starIcon}
                style={{
                  width: 15,
                  height: 15,
                  tintColor: 'white',
                }}
              />
            </View>
          </Marker>
        )}

        {/* navigation */}
        <Polyline
          coordinates={lineString.coordinates.map((coord) => (
            {
              latitude: coord[0],
              longitude: coord[1],
            }
          ))}
          strokeWidth={8}
          lineCap='square'
          lineJoin='round'
        />

        {/* Voronoi Polygon */}
        {toggleVoronoi && (
          <Polyline
            coordinates={voroniPolygon.coordinates.map((coord) => (
              {
                latitude: coord[0],
                longitude: coord[1],
              }
            ))}
            strokeWidth={5}
            lineCap='square'
            lineJoin='round'
            strokeColor='purple'
          />
        )}

      </MapView>

      {/* Floating buttons */}
      <View style={styles.floatingButtonContainer}>
        {showButtons && buttonData.map((button, index) => (
          button.userRole === authCredentials!.userRole &&
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

      {/* listing modal */}
      {showListingModal && (
        <ListingModal closeModal={() => setShowListingModal(false)} />
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
  markerContainer: {},
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
