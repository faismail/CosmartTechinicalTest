import React, {Component, useEffect, useState} from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, FlatList, ActivityIndicator} from 'react-native';
import { Container, Content, Grid, Col, Card, Icon,} from 'native-base';
import {RFValue, RFPercentage } from "react-native-responsive-fontsize";
import LinearGradient from 'react-native-linear-gradient';
import  Modal,{ ModalContent,  ScaleAnimation, ModalFooter, ModalButton, ModalTitle, SlideAnimation } from 'react-native-modals';
import axios from "axios";

const BookList = ({navigation}) => {

  const [Books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);


  const [NamaAZ, setNamaAZ] = useState(false);
  const [NamaZA, setNamaZA] = useState(false);
  const [newRelease, setNewRelease] = useState(false);
  const [oldRelease, setOldRelease] = useState(false);

 
  const handleChange = (e) => {
    console.log(e)
      setSearchName(e);
    };

  const cekAZ = () => {
    return NamaAZ ?  (
      <View style={[styles.radioButtonInner]} />
    ) : null
  };
  const cekZA = () => {
    return NamaZA ?  (
      <View style={[styles.radioButtonInner]} />
    ) : null
  };
  const cekNewest = () => {
    return newRelease ?  (
      <View style={[styles.radioButtonInner]} />
    ) : null
  };
  const cekOldest = () => {
    return oldRelease ?  (
      <View style={[styles.radioButtonInner]} />
    ) : null
  };

  const sortAZ = () => {
    Books.sort((a, b) => (a.title > b.title) ? 1 : -1)
    setModalVisible(false)
    setNamaAZ(true), setNamaZA(false), setOldRelease(false), setNewRelease(false)
  };

  const sortZA = () => {
    Books.sort((a, b) => (b.title > a.title) ? 1 : -1)
    setModalVisible(false)
    setNamaAZ(false), setNamaZA(true), setOldRelease(false), setNewRelease(false)
  };

  const newestRelease = () => {
    Books.sort((a, b) => (b.first_publish_year > a.first_publish_year) ? 1 : -1)
    setModalVisible(false)
    setNamaAZ(false), setNamaZA(false), setOldRelease(false), setNewRelease(true)
  };

  const oldestRelease = () => {
    Books.sort((a, b) => (a.first_publish_year > b.first_publish_year) ? 1 : -1)
    setModalVisible(false)
    setNamaAZ(false), setNamaZA(false), setOldRelease(true), setNewRelease(false)
  };

  const getBooksList = async () => {
    setIsLoading(true);
    fetch('https://openlibrary.org/subjects/fiction.json?details=true')
    .then(response => response.json())
    .then(data => {
      const books = data.works;
      setBooks(books)
      // books.forEach(book => {
      // const key = book.key
      // const title = book.title;
      // const author = book.authors[0].name;
      // const year = book.first_publish_year;
      //   console.log(`Key: ${key} Title: ${title} Author: ${author} Year: ${year}`);
      // });
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity key={item.key} onPress={() => navigation.navigate('BookSchedule', 
                        {item })}>
        <LinearGradient useAngle={true}
                      angle={200}
                      colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.19)']}
                      locations={[0,1]}
                      start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                      style={styles.CardList}>  
            <Col style={{  flexDirection:'row',}}>

                <Col style={{width:'35%', alignSelf:'center', }}>  
                    <Image
                      source={{ uri: `https://covers.openlibrary.org/b/id/${item.cover_id}-M.jpg` }}
                      style={{width: RFPercentage(10), height: RFPercentage(15), alignSelf:'center', borderRadius:10, }}
                    />
                </Col>

                <Col style={{ width:'65%', height:'100%', alignSelf:'center', justifyContent:'space-around', flexDirection:'column'}}>

                    <Col style={{ width:'100%',}}>
                      <Text style={styles.ListText}>{item.title} ({item.first_publish_year}) </Text>
                    </Col>

                    <Col style={{width:'100%',  flexDirection:'row', alignItems:'center', justifyContent:'space-between'  }}>
                      <View >
                        <Text style={styles.DateText}>{item.authors[0].name} - {item.edition_count}</Text>
                      </View>
                    </Col>
                </Col>
            </Col>
        </LinearGradient>
      </TouchableOpacity>
    )
  };

  const renderLoader = () => {
    return (
      isLoading ?
      <View style={{ alignSelf:'center', marginTop:'10%', }}>
          <ActivityIndicator size="large" color="white" />
      </View> : null
    )
  }

  useEffect(() => {
    setIsLoading(true);
    getBooksList();

  },[]);

    return (
      <SafeAreaView style={styles.container}>
            <Col style={{ marginVertical:'5%', alignItems:'center'}}>
                <View style={styles.SearchBar}>
                  <Icon type="FontAwesome" name="search" style={{justifyContent:'center', marginHorizontal:'2%',  fontSize:RFValue(25, 680),  color:'black' }}/>
                    <TextInput
                        style={{ width:'60%',  }}
                        placeholder="Search Books"
                        placeholderTextColor="grey"
                        fontFamily="Avenir Next"
                        fontSize={16}
                        fontWeight={'500'}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        onChangeText={handleChange}
                    />
                    <TouchableOpacity style={{ width:'20%', flexDirection:'row',  }} 
                                      onPress={() => setModalVisible (true) }>
                          <Text style={styles.SortingText}> 
                            SORT
                          </Text>
                          <Icon type="FontAwesome" name="caret-down" style={{ marginHorizontal:'5%',  fontSize:RFValue(18, 680),  color:'orange' }}/>
                    </TouchableOpacity>
                </View>

                <FlatList style={styles.CardList}
                          data={Books}
                          showsHorizontalScrollIndicator={false}
                          keyExtractor={item => `${item.key}`}
                          renderItem={renderItem}
                          ListFooterComponent={renderLoader}
                          >
                </FlatList>
            </Col>

            <Modal visible={ modalVisible }
                      onTouchOutside={() => setModalVisible (false) } 
                      swipeDirection={['up', 'down']} 
                      swipeThreshold={200} 
                      onSwipeOut={() => setModalVisible (false) }
                      modalAnimation={new SlideAnimation({slideFrom: 'bottom', initialValue: 0, useNativeDriver: (true) })}
                      >
                <ModalContent style={{ backgroundColor: 'white' }} >

                    <Col style={{width:RFPercentage(35), height:RFPercentage(30), justifyContent:'center'}}>
                      <TouchableOpacity style={styles.mainContainer} onPress={ (sortAZ)}>
                        <View style={[styles.radioButtonIcon]}>
                          {cekAZ()}
                        </View>
                        <View style={[styles.radioButtonTextContainer]}>
                          <Text style={styles.SortText}>A - Z</Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.mainContainer} onPress={ (sortZA)}>
                        <View style={[styles.radioButtonIcon]}>
                          {cekZA()}
                        </View>
                        <View style={[styles.radioButtonTextContainer]}>
                          <Text style={styles.SortText}>Z - A</Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.mainContainer} onPress={ (newestRelease)}>
                        <View style={[styles.radioButtonIcon]}>
                          {cekNewest()}
                        </View>
                        <View style={[styles.radioButtonTextContainer]}>
                          <Text style={styles.SortText}>Newest Release</Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.mainContainer} onPress={ (oldestRelease)}>
                        <View style={[styles.radioButtonIcon]}>
                          {cekOldest()}
                        </View>
                        <View style={[styles.radioButtonTextContainer]}>
                          <Text style={styles.SortText}>Oldest Release</Text>
                        </View>
                      </TouchableOpacity>
                    </Col>       
                </ModalContent>
            </Modal>
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    padding: 5,
    backgroundColor: 'black',
    alignItems:'center',
    justifyContent:'center',
    },

  CardList: {
    width: RFPercentage(48),
    height:RFPercentage(17),
    paddingHorizontal:'5%',
    borderRadius:20, 
    borderWidth:1,
    alignSelf:'center',
    marginVertical:'3%',
  },

  SearchBar: {
    width: '100%',
    height:RFPercentage(5.5),
    marginLeft:'2%',
    alignSelf:'center',
    alignItems:'center',
    textAlign:'center',
    justifyContent:'center', 
    borderRadius: 8,
    backgroundColor: "white",
    flexDirection: "row",
  },

  ListText:{
    fontFamily: 'Avenir Next',
    fontWeight: '600',
    fontSize: RFValue(17, 680),
    color:'white',
    justifyContent:'center',
  },

  DateText:{
    fontFamily: 'Avenir Next',
    fontSize: RFValue(14, 680),
    color:'white',
    justifyContent:'center',
  },

  ViewInfo: {
    width:RFPercentage(7), 
    height:RFPercentage(3.5), 
    borderRadius:10, 
    borderWidth:1, 
    borderColor:'grey', 
    flexDirection:'row', 
    alignItems:'center',
    alignSelf:'flex-end',
    justifyContent:'center',
  },

  InfoText:{
    fontFamily: 'Avenir Next',
    fontWeight: '500',
    fontSize: RFValue(14, 680),
    color:'white',
    justifyContent:'center'
  },
  mainContainer: {
    height: RFPercentage(6),
    width: '100%',
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    marginVertical:'3%',
  },
  radioButtonIcon: {
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: '#fd6542',
    height: RFPercentage(4),
    width: RFPercentage(4),
    borderRadius: 20,
    marginRight: '5%',
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonInner: {
    height: RFPercentage(2.5),
    width: RFPercentage(2.5),
    backgroundColor:'#fd6542',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "white",
  },

});

export default BookList;


