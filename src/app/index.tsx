import { Link } from "expo-router"
import { View } from "react-native"
import Button from "../components/Button"

const index = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
            <Link href={'/(user)'} asChild>
                <Button text="User" />
            </Link>
            <Link href={'/(admin)'} asChild>
                <Button text="Admin" />
            </Link>
            {/* (auth) segment of a path is optional. So sign-in works as is or with (auth) prepended to */}
            <Link href={'/sign-in'} asChild>
                <Button text="Auth" />
            </Link>
        </View>
    )
}

export default index