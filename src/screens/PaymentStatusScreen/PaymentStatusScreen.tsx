import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Animated,
} from "react-native";
import HeaderComponent from "../../components/HeaderComponent";
import { apiGet } from "../../api/Api";

export default class PaymentStatusScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeline: [],
      loading: true,
      fadeAnim: new Animated.Value(0),
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    this.setState({ loading: true, timeline: [] });
    try {
      const result = await apiGet("clients/get-timeline");
      console.log("Timeline Data:", result);

      if (result && result.success && result.timeline?.length > 0) {
        this.setState(
          { timeline: result.timeline, loading: false },
          this.startAnimation
        );
      } else {
        console.warn("No timeline data found");
        this.setState({ loading: false });
      }
    } catch (error) {
      console.error("Error fetching timeline:", error);
      this.setState({ loading: false });
    }
  };

  startAnimation = () => {
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  renderItem = ({ item, index }) => {
    const isLast = index === this.state.timeline.length - 1;

    return (
      <View style={styles.itemContainer}>
        <View style={styles.timeline}>
          <View style={styles.circle} />
          {!isLast && <View style={styles.line} />}
        </View>
        <Animated.View style={[styles.content, { opacity: this.state.fadeAnim }]}>
          <Text style={styles.date}>{this.formatDate(item.createdAt)}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.description}</Text>
        </Animated.View>
      </View>
    );
  };

  render() {
    const { timeline, loading } = this.state;

    return (
      <View style={styles.container}>
        <HeaderComponent
          title="Payment Status"
          showBack={true}
          onBackPress={() => this.props.navigation.goBack()}
        />

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#7B5CFA" />
          </View>
        ) : (
          <FlatList
            data={timeline}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No timeline data found.</Text>
            }
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: 24,
    alignItems: "flex-start",
  },
  timeline: {
    alignItems: "center",
    marginRight: 12,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#2563EB",
    zIndex: 1,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: "#2563EB",
    marginTop: 2,
  },
  content: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  date: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#374151",
    marginTop: 2,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#999",
  },
});
