import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {StartedPage, BookList, BookSchedule } from "../Pages"


const Stack = createStackNavigator();

const Router = ({ navigation }) => {
  return (
    <Stack.Navigator>
        <Stack.Screen
            name="StartedPage"
            component={StartedPage}
            options={{
            headerShown: false,
            }}
        />
        <Stack.Screen
            name="BookList"
            component={BookList}
            options={{
            headerShown: false,
            }}
        />
        <Stack.Screen
            name="BookSchedule"
            component={BookSchedule}
            options={{
            headerShown: false,
            }}
        />
    </Stack.Navigator>
  );
};

export default Router;
