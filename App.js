import { View, Text, TouchableOpacity, ActivityIndicator, Button } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import { Image } from "react-native";

import * as ImagePicker from "expo-image-picker";
import { storage } from "./firebase/firebase.config";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

const App = () => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    setIsLoading(true);
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (result.assets) {
      const uploadURL = await uploadImageAsync(result.assets[0].uri);

      setImage(uploadURL);

      setIsLoading(false);
    } else {
      setImage(null);
      setIsLoading(false);
    }
  };

  async function uploadImageAsync(uri) {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const fileRef = ref(storage, `images/image-${Date.now()}`);
    await uploadBytes(fileRef, blob);

    // We're done with the blob, close and release it
    blob.close();

    return await getDownloadURL(fileRef);
  }

  const handleDelete = async () => {
    setIsLoading(true);

    const deleteRef = ref(storage, image);

    await deleteObject(deleteRef);
    setImage(null);
    setIsLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <View className="px-6 w-full">
        {!image ? (
          <View className="w-full h-64 border-2 border-dashed border-gray-200 rounded-md bg-gray-100 items-center justify-center">
            <TouchableOpacity onPress={pickImage}>
              {isLoading ? (
                <View className="items-center justify-center">
                  <ActivityIndicator color="#ff0000" animating size="large" />
                </View>
              ) : (
                <Text className="text-xl text-gray-700 font-semibold">Pick an image</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {image && (
              <View className="w-full h-64 rounded-md overflow-hidden items-center justify-center mb-2">
                <Image source={{ uri: image }} className="w-full h-full" />
              </View>
            )}

            <Button title="Delete Image" onPress={handleDelete} />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default App;
