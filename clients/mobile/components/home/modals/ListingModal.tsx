import { Modal, View, StyleSheet, Text, ScrollView, TouchableOpacity } from "react-native";

// stores
import { useMarketStore } from "@/stores/MarketStores";

interface ListingModal {
    closeModal: () => void;
}

const ListingModal: React.FC<ListingModal> = ({ closeModal }) => {

    // stores
    const markets = useMarketStore(state => state.markets);

    const getColorWithinTheRange = (voronoicalValue: number) => {
        if (voronoicalValue < 0.25) {
            return "rgba(0, 255, 0, 1)";
        } else if (voronoicalValue >= 0.25 && voronoicalValue < 0.5) {
            return "rgba(255, 255, 0, 1)";
        } else if (voronoicalValue >= 0.5 && voronoicalValue < 0.75) {
            return "rgba(255, 165, 0, 1)";
        } else {
            return "rgba(255, 0, 0, 1)";
        }
    }

    return (
        <View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={true}
                onRequestClose={() => {
                    console.log("Modal has been closed.");
                }}
            >
                <View style={styles.modal}>
                    <View style={styles.headers}>
                        <Text style={styles.text0}>Id | Market Name</Text>
                        <Text style={styles.text1}>Voronoical Score</Text>
                    </View>
                    <ScrollView style={styles.listingGrid}>
                        {markets.map((market, index) => (
                            <View key={index} style={styles.listing}>
                                <Text style={styles.listingText}>{market.id + " | " + market.name}</Text>
                                <Text style={{ ...styles.listingText, backgroundColor: getColorWithinTheRange(market.voronoiScore) }}>{market.voronoiScore}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
                <TouchableOpacity style={styles.floatingCloseButton} onPress={() => {
                    closeModal();
                }}>
                    <Text style={{ fontSize: 25 }}>✖</Text>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}


const styles = StyleSheet.create({
    modal: {
        backgroundColor: 'rgba(0, 0, 0, 0.90)',
        width: '100%',
        height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headers: {
        flexDirection: "row",
        width: '100%',
        paddingHorizontal: 32,
        paddingVertical: 16,
        marginTop: 55,
        backgroundColor: 'rgba(0, 0, 0, 0.80)',
        justifyContent: "space-between",
    },
    row: {
        justifyContent: "space-between"
    },
    text0: {
        fontWeight: "bold",
        color: "white"
    },
    text1: {
        fontWeight: "bold",
        color: "white"
    },
    listingGrid: {
        width: '100%',
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginBottom: 44,
    },
    listing: {
        width: '100%',
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    listingText: {
        color: "white"
    },
    floatingCloseButton: {
        position: 'absolute',
        bottom: 58,
        right: 24,
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 100,
        alignItems: 'center',
    },
});


export default ListingModal;