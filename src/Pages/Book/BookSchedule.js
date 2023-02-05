import React, {Component, useEffect, useState, useCallback} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Animated, ImageBackground, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Container, Content, Grid, Col, Card, Icon, Input} from 'native-base';
import {RFValue, RFPercentage } from "react-native-responsive-fontsize";
import Modal, { ModalContent, SlideAnimation } from "react-native-modals";
import CalendarPicker from "react-native-calendar-picker";
import LinearGradient from 'react-native-linear-gradient';
import Snackbar from 'react-native-snackbar';
import axios from "axios";

const BookSchedule = ({route, navigation}) => {

  const { item } = route.params;
  const [bookDetail, setBookDetail] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [lengthMore,setLengthMore] = useState(false); 
  const [numOfLines, setNumOfLines ] = useState(0);
  const [modalCalendarVisible, setModalCalendarVisible] = useState(false);
  const [modalDetailVisible, setModalDetailVisible] = useState(false);
  
  const monthNames = ['January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
  ];

  const DayName = [ "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
  ];

  const getBookDetail = () => {
    fetch(`https://openlibrary.org${item.key}.json`)
    .then(response => response.json())
    .then(data => {
      setBookDetail(data);
    })
    .catch((error) => {
      console.error(error);
    });
  };

  const onTextLayout = useCallback(e => {
    if(numOfLines == 0)
        setNumOfLines(e.nativeEvent.lines.length);
  });

  const onLoadMoreToggle = () => {
    setLengthMore(!lengthMore);
  };

  const showDatePicker = () => {
    setModalCalendarVisible(true)
  };

  const CancelModalPicker = () => {
    setSelectedDate(null)
    setModalCalendarVisible(false)
    setModalDetailVisible(false)
  };

  const onDateChange = (value, type) => { 
    if (type === "START_DATE") {
        setSelectedDate(value)
      }
  }

  let yesterday = new Date();

  const convertWaktuTanggal = (waktu) => {
      if (waktu) {
        let hari = new Date(waktu).getDay();
        let jam =
          new Date(waktu).getHours() < 10
            ? "0" + new Date(waktu).getHours()
            : new Date(waktu).getHours();
        let menit =
          new Date(waktu).getMinutes() < 10
            ? "0" + new Date(waktu).getMinutes()
            : new Date(waktu).getMinutes();
        let detik =
          new Date(waktu).getSeconds() < 10
            ? "0" + new Date(waktu).getSeconds()
            : new Date(waktu).getSeconds();
        let date = new Date(waktu).getDate();
        let month = new Date(waktu).getMonth();
        let year = new Date(waktu).getFullYear();
  
        return `${DayName[hari]}, ${date} ${monthNames[month]} ${year}`;
      } else {
        return "--:--:--";
      }
  };

  const pickUpdate = convertWaktuTanggal(selectedDate)

  const setPickUpSchedule = () => {
    if (pickUpdate == "--:--:--") {
      alert("Please Pick a date")
    }
    else {
      setModalCalendarVisible(false)
      setModalDetailVisible(true)
    }
  }

  const snackBarCreated = () => {
    setModalDetailVisible(false)
    Snackbar.show({
      text: 'Congrats, Your Schedule has been created !',
      duration: Snackbar.LENGTH_SHORT,
    })
    navigation.goBack() 
  }

 
  useEffect(() => {
    getBookDetail();
  },[]);

  return bookDetail.key ? (
    <ScrollView style={styles.container}
                showsVerticalScrollIndicator={false}>
      <Col style={styles.BoxBackDrop} >
            <ImageBackground  
                source={{ uri: `https://covers.openlibrary.org/b/id/${item.cover_id}-M.jpg` }}
                style={{width: RFPercentage(22),height: RFPercentage(35), alignSelf:'center', resizeMode: 'cover', justifyContent:'flex-end', marginTop:'10%'}}
            >
            </ImageBackground> 
      </Col>

      <Col style={styles.BoxInfo}>
            <Text style={styles.ListText}>
              {bookDetail.title} ({item.first_publish_year}) -- {item.edition_count}
            </Text>

            <Text style={styles.AuthorText}>
              Author - {item.authors[0].name}
            </Text>

            <Text onTextLayout={onTextLayout}
                  numberOfLines={numOfLines == 0 ? null : lengthMore ? numOfLines : 4} 
                  style={styles.OverviewText}
                  >
              {bookDetail.description}
            </Text>

            {
                (numOfLines > 4) &&
                <TouchableOpacity onPress={onLoadMoreToggle}>
                    <Text style={styles.ReadMoreText}>{ lengthMore ? 'Read Less' : 'Read More'}</Text>
                </TouchableOpacity>
            }
      </Col>

      <Col>
          <TouchableOpacity
            onPress={showDatePicker}
          >
            <LinearGradient useAngle={true}
                      angle={200}
                      colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.19)']}
                      locations={[0,1]}
                      start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                      style={styles.CardList}>  

              <Text style={[styles.CalendarText]}>Set Pick Up Date</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Col>


      <Modal
          visible={modalCalendarVisible}
          onTouchOutside={CancelModalPicker}
          swipeDirection={["up", "down"]}
          swipeThreshold={200}
          onSwipeOut={CancelModalPicker}
          modalAnimation={
            new SlideAnimation({
              slideFrom: "bottom",
              initialValue: 0,
              useNativeDriver: true,
            })
          }
        >
          <ModalContent style={{}}>
            
            <View>
              <CalendarPicker
                minDate={yesterday} 
                onDateChange={onDateChange}
                selectedDayColor="#264F71"
                todayBackgroundColor="grey"
              />
            </View>

            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: "8%",
              }}
            >
              <Text style={[styles.CalendarText, {color: "black"}]}>
                Pick Up Date : {pickUpdate}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: "10%",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  width: RFPercentage(12),
                  height: RFPercentage(5),
                  borderRadius: 20,
                  backgroundColor: "grey",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={CancelModalPicker}
              >
                <Text style={[styles.CalendarText, {color: "black"}]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  width: RFPercentage(12),
                  height: RFPercentage(5),
                  borderRadius: 20,
                  backgroundColor: "#264F71",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={setPickUpSchedule}
              >
                <Text style={[styles.CalendarText, { color: "white" }]}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </ModalContent>
      </Modal>

      <Modal
          visible={modalDetailVisible}
          onTouchOutside={null}
          swipeDirection={null}
          onSwipeOut={null}
          modalAnimation={
            new SlideAnimation({
              slideFrom: "bottom",
              initialValue: 0,
              useNativeDriver: true,
            })
          }
        >
          <ModalContent style={{}}>
            
            <View style={{ alignSelf:'center'}}>
              <Text style={[styles.ReadMoreText, {color: "black"}]}>
                Pick Up Detail
              </Text>
            </View>

            <View>
              <Text style={[styles.DetailText, {color: "black"}]}>
                Book Name : {bookDetail.title} 
              </Text>
              <Text style={[styles.DetailText, {color: "black"}]}>
                Book Year : {item.first_publish_year} 
              </Text>
              <Text style={[styles.DetailText, {color: "black"}]}>
                Book Author : {item.authors[0].name}
             </Text>
              <Text style={[styles.DetailText, {color: "black"}]}>
                Book Edition : {item.edition_count}
              </Text>
              <Text style={[styles.DetailText, {color: "black"}]}>
                Pick Up Schedule : {pickUpdate}
              </Text>
            </View>

            <View style={{ alignSelf:'center', marginTop:'5%'}}>
              <Text style={[styles.ReadMoreText, {color: "black"}]}>
                xx Please be On Time xx
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  width: RFPercentage(12),
                  height: RFPercentage(5),
                  borderRadius: 20,
                  backgroundColor: "#264F71",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress= {snackBarCreated}
                
              >
                <Text style={[styles.CalendarText, { color: "white" }]}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </ModalContent>
      </Modal>
    </ScrollView>
    
) : (
    <View style={styles.indicator}>
      <ActivityIndicator size="large" color="white"  />
    </View>
  );
};

const styles = StyleSheet.create({

container: {
  flex: 1,
  backgroundColor: 'black',
  },

BoxBackDrop: {
  flex:1,
  width: '100%',
  height: '50%',
  alignItems:'center',
},

BoxInfo: {
  flex:1,
  width: '100%',
  height: '20%',
  marginTop:'2%'
},

ListText:{
  fontFamily: 'Avenir Next',
  fontWeight: '700',
  fontSize: RFValue(20, 680),
  color:'white',
  marginTop:'3%',
  paddingHorizontal:'3%',
},

CalendarText:{
  alignSelf: 'center',
  justifyContent: 'center',
  fontFamily: 'Avenir Next',
  fontWeight:'500',
  marginTop:'1%',
  fontSize: RFValue(16, 680),
  color:'white',
},

AuthorText:{
  fontFamily: 'Avenir Next',
  fontSize: RFValue(18, 680),
  color:'white',
  marginTop:'5%',
  paddingHorizontal:'3%',
},

OverviewText:{
  flex:1,
  fontFamily: 'Avenir Next',
  fontSize: RFValue(16, 680),
  color:'white',
  paddingHorizontal:'3%',
  marginTop:'2%',
},

CardList: {
  width: RFPercentage(40),
  height:RFPercentage(5),
  paddingHorizontal:'5%',
  borderRadius:20, 
  borderWidth:1,
  alignSelf:'center',
  marginVertical:'3%',
},

InfoText:{
  fontFamily: 'Avenir Next',
  fontWeight: '500',
  fontSize: RFValue(14, 680),
  color:'white',
  justifyContent:'center'
},

SimilarText:{
  fontFamily: 'Avenir Next',
  fontWeight: '500',
  fontSize: RFValue(14, 680),
  color:'white',
},

ReadMoreText:{
  fontFamily: 'Avenir Next',
  fontWeight: '700',
  fontSize: RFValue(14, 680),
  color:'white',
  marginTop:'1%',
  marginLeft:'3%',
  marginBottom:'10%'
},

DetailText:{
  fontFamily: 'Avenir Next',
  fontWeight: '500',
  fontSize: RFValue(14, 680),
  color:'white',
  marginTop:'1%',
  marginLeft:'3%',
  marginBottom:'5%'
},

indicator: {
  flex: 1,
  backgroundColor: 'black',
  alignItems: 'center',
  justifyContent: 'center',
},

});

export default BookSchedule;