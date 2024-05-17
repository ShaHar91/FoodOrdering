import { StyleSheet, Text, View, TextInput, Image, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Button from '@/src/components/Button'
import { defaultPizzaImage } from '@/src/components/ProductListItem'
import Colors from '@/src/constants/Colors'
import * as ImagePicker from 'expo-image-picker'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useDeleteProduct, useInsertProduct, useProduct, useUpdateProduct } from '@/src/api/products'
import { randomUUID } from 'expo-crypto'
import { supabase } from '@/src/lib/supabase'
import * as FileSystem from 'expo-file-system'
import { decode } from 'base64-arraybuffer'
import RemoteImage from '@/src/components/RemoteImage'

const CreateProductScreen = () => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [errors, setErrors] = useState('')
  const [image, setImage] = useState<string | null>(null)

  const { id: idString } = useLocalSearchParams()
  const id = parseFloat(typeof idString === 'string' ? idString : idString?.[0] ?? "")
  const isUpdating = !!id // Id is defined!!

  const { mutate: insertProduct } = useInsertProduct()
  const { mutate: updateProduct } = useUpdateProduct()
  const { mutate: deleteProduct } = useDeleteProduct()
  const { data: updatingProduct } = useProduct(id)

  const router = useRouter()

  useEffect(() => {
    if (updatingProduct) {
      setName(updatingProduct.name)
      setPrice(updatingProduct.price.toString())
      setImage(updatingProduct.image)
    }

  }, [updatingProduct])

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

  const onSubmit = () => {
    if (isUpdating) {
      onUpdate()
    } else {
      onCreate()
    }
  }

  const onUpdate = async () => {
    if (!validateInput()) {
      return
    }

    const imagePath = await uploadImage()

    updateProduct({ id, name, price: parseFloat(price), image: imagePath }, {
      onSuccess: () => {
        resetFields()
        router.back()
      }
    })
  }

  const onCreate = async () => {
    if (!validateInput()) {
      return
    }

    const imagePath = await uploadImage()

    insertProduct({ name, price: parseFloat(price), image: imagePath }, {
      onSuccess: () => {
        resetFields()
        router.back()
      }
    })
  }

  const onDelete = () => {
    deleteProduct(id, {
      onSuccess: () => {
        router.replace('/(admin)')
      }
    })
  }

  const confirmDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this product?", [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete }
    ])
  }

  const refPriceInput = useRef<any>(null)


  const uploadImage = async () => {
    if (!image?.startsWith('file://')) return

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: 'base64'
    })
    const filePath = `${randomUUID()}.png`
    const contentType = 'image/png'
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, decode(base64), { contentType })

    console.log(error)

    if (data) {
      return data.path
    }
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: isUpdating ? 'Update Product' : 'Create Product' }} />

      <RemoteImage path={image} fallback={defaultPizzaImage} style={styles.image} resizeMode='contain' />
      
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
      <Button text={isUpdating ? 'Update' : 'Create'} onPress={onSubmit} />

      {isUpdating && <Text onPress={confirmDelete} style={styles.textButton}>Delete</Text>}
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