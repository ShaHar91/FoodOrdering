import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import Button from '@/src/components/Button'
import { supabase } from '@/src/lib/supabase'

const ProfileScreen = () => {
    return (
        <View>
            <Button text="Sign out" onPress={() => supabase.auth.signOut()} />
        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({})