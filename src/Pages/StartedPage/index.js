import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card, CardItem, Container, Text,  Col} from 'native-base';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {CosmartLogo} from '../../Assets/Images/index';

const StartedPage = ({ navigation }) => {

  return (
    <Container style={styles.container}>
        <Col style={{  justifyContent:'center', alignSelf:'center',  }}>  
                <TouchableOpacity onPress={()=>navigation.navigate('BookList')}>
                    <Image style={styles.logoStyle} source={CosmartLogo} />
                    <Text style={styles.buttonText}>
                        Getting Started
                    </Text>
                </TouchableOpacity>     
        </Col>
    </Container>
  );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },

    logoStyle: {
        alignSelf: 'center',
        justifyContent: 'center',
        width: RFPercentage(30),
        height: RFPercentage(30),
        },

    buttonText: {
        fontFamily: 'Avenir Next',
        fontSize: RFValue(25, 680),
        color: 'black',
        textAlign: 'center',
    },
});


export default StartedPage;