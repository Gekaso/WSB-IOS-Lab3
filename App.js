import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";

const API_URL = "https://api.jsonplaceholder.dev/posts";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newUserId, setNewUserId] = useState("");

  // Pobieranie danych przy starcie [cite: 834, 847]
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Błąd serwera");

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError("Nie udało się pobrać danych.");
    } finally {
      setIsLoading(false);
    }
  };

  // Wysyłanie danych metodą POST [cite: 816, 837]
  const createPost = async () => {
    if (!newTitle || !newBody || !newUserId) {
      Alert.alert("Błąd", "Wypełnij wszystkie pola!");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          body: newBody,
          userId: parseInt(newUserId),
        }),
      });

      if (!response.ok) throw new Error("Błąd wysyłania");

      const result = await response.json();
      Alert.alert("Sukces!", "Post wysłany.");

      setNewTitle("");
      setNewBody("");
      setNewUserId("");
    } catch (err) {
      Alert.alert("Błąd", err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Dodaj post (POST)</Text>
        <TextInput
          style={styles.input}
          placeholder="Tytuł"
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Treść"
          value={newBody}
          onChangeText={setNewBody}
        />
        <TextInput
          style={styles.input}
          placeholder="User ID"
          value={newUserId}
          onChangeText={setNewUserId}
          keyboardType="numeric"
        />
        <Pressable style={styles.button} onPress={createPost}>
          <Text style={styles.buttonText}>Wyślij</Text>
        </Pressable>
      </View>

      <View style={styles.list}>
        <Text style={styles.label}>Lista postów (GET)</Text>
        {isLoading && <ActivityIndicator size="large" />}
        {error && <Text style={{ color: "red" }}>{error}</Text>}
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardId}>ID: {item.id}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text>{item.body}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  form: { padding: 20, borderBottomWidth: 1, borderColor: "#eee" },
  label: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  list: { flex: 1, padding: 20 },
  card: { padding: 15, borderBottomWidth: 1, borderColor: "#eee" },
  cardId: { fontSize: 10, color: "#888" },
  cardTitle: { fontWeight: "bold", fontSize: 16 },
});
