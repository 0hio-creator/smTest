import {
    Alert,
    Dimensions,
    Image,
    Linking,
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
} from "react-native";

const { height, width } = Dimensions.get("screen");

export type article = {
    title: string;
    description?: string;
    url: string;
    urlToImage?: string;
    publishedAt: string;
    content: string;
    author: string;
};

type Props = {
    item: article;
    index: number;
};

/** open the news article in an external browser*/
const openArticleInBrowser = async (url: string) => {
    if (await Linking.canOpenURL(url)) {
        Linking.openURL(url);
    } else {
        Alert.alert("Error", "Could not open the article in the browser");
    }
};

export const Article = ({ item, index }: Props) => {
    return (
        <TouchableOpacity
            style={styles.newsArticle}
            key={`newsArticle-${index}`}
            onPress={() => {
                openArticleInBrowser(item.url);
            }}
        >
            <View style={styles.articleHeader}>
                {item.urlToImage && (
                    <Image
                        style={styles.image}
                        source={{
                            uri: item.urlToImage,
                        }}
                    />
                )}
                <View style={styles.titleContainer}>
                    <Text numberOfLines={3} style={styles.title}>
                        {item.title}
                    </Text>
                    <Text numberOfLines={2} style={styles.byLine}>{`${
                        item.author || ""
                    } ${item.publishedAt}  `}</Text>
                </View>
            </View>
            <Text numberOfLines={5} style={styles.content}>
                {item.description || ""}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    newsArticle: {
        backgroundColor: "white",
        marginVertical: 2,
        width: width - 8,
        marginHorizontal: 4,
    },
    articleHeader: {
        flex: 1,
        flexDirection: "row",
    },
    image: {
        width: 100,
        height: 100,
    },
    titleContainer: { flex: 1, paddingLeft: 8, paddingTop: 8 },
    title: { fontSize: 16, fontWeight: "bold" },
    byLine: { fontSize: 12, color: "gray" },
    content: { padding: 8 },
});
