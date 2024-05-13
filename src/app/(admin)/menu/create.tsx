import { StyleSheet, Text, View, TextInput, Image } from 'react-native'
import React, { useRef, useState } from 'react'
import Button from '@/src/components/Button'
import { defaultPizzaImage } from '@/src/components/ProductListItem'
import Colors from '@/src/constants/Colors'
import * as ImagePicker from 'expo-image-picker'
import { Stack } from 'expo-router'

const CreateProductScreen = () => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [errors, setErrors] = useState('')

  const [image, setImage] = useState<string | null>(null)

  const pickImage = async () => {
    // No permissions request is necessary for launging the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  const resetFields = () => {
    setName('')
    setPrice('')
  }

  const validateInput = () => {
    setErrors('')

    if (!name) {
      setErrors("Name is required")
      return false
    }

    if (!price) {
      setErrors("Price is required")
      return false
    }

    if (isNaN(parseFloat(price))) {
      setErrors("Price is not a number")
      return false
    }

    return true
  }

  const onCreate = () => {
    if (!validateInput()) {
      return
    }

    console.warn('Creating product', name, price)

    // save in the database

    resetFields()
  }

  const refPriceInput = useRef<any>(null)

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Create Product' }} />

      <Image source={{ uri: image || defaultPizzaImage }} style={styles.image} />
      <Text style={styles.textButton} onPress={pickImage}>Select Image</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        placeholder='Name'
        placeholderTextColor='gainsboro'
        style={styles.input}
        returnKeyType='next'
        value={name}
        onChangeText={(e) => setName(e)}
        onSubmitEditing={() => {
          refPriceInput.current.focus()
        }}
      />

      <Text style={styles.label}>Price ($)</Text>
      <TextInput
        ref={refPriceInput}
        placeholder='Price'
        placeholderTextColor='gainsboro'
        value={price}
        onChangeText={(e) => setPrice(e)}
        style={styles.input}
        keyboardType='numeric'
      />

      <Text style={{ color: 'red' }}>{errors}</Text>
      <Button text='Create' onPress={onCreate} />
    </View>
  )
}

export default CreateProductScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20
  },
  label: {
    color: 'gray',
    fontSize: 16
  },
  image: {
    width: '50%',
    aspectRatio: 1,
    alignSelf: 'center'
  },
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginVertical: 10
  }
})