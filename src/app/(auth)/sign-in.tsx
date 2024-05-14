import { Alert, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { Link, Stack } from 'expo-router'
import Button from '@/src/components/Button'
import Colors from '@/src/constants/Colors'
import { supabase } from '@/src/lib/supabase'

const SignInScreen = () => {
  const refPasswordInput = useRef<any>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState('')
  const [loading, setLoading] = useState(false)

  const resetFields = () => {
    setEmail('')
    setPassword('')
  }

  async function signInWithEmail() {
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      Alert.alert("FoodOrdering", error.message)
      setLoading(false)
      return
    }

    resetFields()
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Sign in' }} />

      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder='john@gmail.com'
        placeholderTextColor='gainsboro'
        style={styles.input}
        returnKeyType='next'
        keyboardType='email-address'
        value={email}
        textContentType='emailAddress'
        onChangeText={(e) => setEmail(e)}
        onSubmitEditing={() => {
          refPasswordInput.current.focus()
        }}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        ref={refPasswordInput}
        placeholder=''
        placeholderTextColor='gainsboro'
        value={password}
        onChangeText={(e) => setPassword(e)}
        textContentType='password'
        secureTextEntry
        style={styles.input}
      />

      <Text style={{ color: 'red' }}>{errors}</Text>

      <Button text='Sign in' disabled={loading} onPress={signInWithEmail} />

      <Link href={'/sign-up'} asChild>
        <Text style={styles.textButton}>Create an account</Text>
      </Link>
    </View>
  )
}

export default SignInScreen

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