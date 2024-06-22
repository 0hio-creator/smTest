import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Linking,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Article, article } from "./components/article";

export default function Index() {
    const [query, setQuery] = useState("");
    const [articles, setArticles] = useState<article[]>([]);
    const [searching, setSearching] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [pageNumber, setPageNumber] = useState(1);

    /** search the api for new related to the query */
    const searchForNews = async () => {
        try {
            console.log("pageNumber: " + pageNumber);
            if (pageNumber == 1) {
                setArticles([]);
            }
            setSearching(true);
            setErrorMessage("");
            const response = await fetch(
                `https://newsapi.org/v2/everything?q=${query}&page=${pageNumber}&apiKey=183daca270264bad86fc5b72972fb82a`
            );
            const data = await response.json();

            if (data.articles && data.articles.length > 0) {
                setArticles([...articles, ...(data.articles as article[])]);
                setSearching(false);
            } else if (data.articles && data.articles.length == 0) {
                setSearching(false);
                setErrorMessage("No results found");
            }
        } catch (error) {
            setSearching(false);
            console.log(error);
            setErrorMessage("Something went wrong. Please try again later.");
        }
    };

    const fetchNextPage = () => {
        setPageNumber(pageNumber + 1);
        searchForNews();
    };

    return (
        <View style={styles.container}>
            {/* Search bar */}
            <View style={styles.textInputRow}>
                <TextInput
                    style={styles.input}
                    onChangeText={setQuery}
                    value={query}
                    placeholder="Search for news"
                />
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={searchForNews}
                >
                    <Text>Search</Text>
                </TouchableOpacity>
            </View>

            {/* Error Message */}
            {errorMessage && (
                <Text style={styles.errorMessage}>{errorMessage}</Text>
            )}

            {/* Search results */}
            <FlatList
                initialNumToRender={20}
                data={articles}
                renderItem={({ item, index }) => (
                    <Article item={item} index={index} />
                )}
                onEndReached={fetchNextPage}
                onEndReachedThreshold={0.8}
            />

            {/* Loading Indicator */}
            {searching && (
                <View style={styles.loadingIndicator}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Searching...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    textInputRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    searchButton: {
        backgroundColor: "lightblue",
        padding: 10,
        borderRadius: 5,
        margin: 10,
    },
    input: {
        width: 250,
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },

    loadingIndicator: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    errorMessage: {
        color: "red",
        alignSelf: "center",
    },
});
