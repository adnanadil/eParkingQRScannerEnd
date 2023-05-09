// Importing the libraries and the files  
import { StyleSheet, Text, View, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeArea } from "./components/SafeArea";

// Importing the firebase functions defined by us in a file and the built in Firestore functions for the library
import { db } from "./utils/firebase.utils";
import { collection, query, where, getDocs } from "firebase/firestore";

import { io } from "socket.io-client";


// This is the main function that defines the functional React component and it has to start with capital letter
export default function App() {
  // Connecting our server and defining a few state variables to be used
   const socket = io.connect("http://dry-brushlands-40059.herokuapp.com");
  // const socket = io.connect("http://localhost:3001");  
  const [hasPermission, setHasPermission] = React.useState(false);
  const [scanData, setScanData] = React.useState();
  const [messageToDisplay, setMessageToDisplay] = useState("");

  const [parkingLots, setParkingLots] = useState([]);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Item 1", value: "1" },
    { label: "Item 2", value: "2" },
    { label: "Item 3", value: "3" },
    { label: "Item 4", value: "4" },
  ]);

  // Function to get all the parking lots from our database we will show this in our dropdown picker
  const getAllTheParkingLots = async () => {
    const q = query(collection(db, "parkingLots"));

    var parkingLotsHolder = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      //   console.log(doc.id, " => ", doc.data());
      parkingLotsHolder.push(doc.data());
    });
    setParkingLots(parkingLotsHolder);
    setItems(parkingLotsHolder);
  };

  // Runs once the component mounts and we will get all the parking lots saved in the database 
  useEffect(() => {
    getAllTheParkingLots();
    console.log(parkingLots);
  }, []);

  // This useEffect is used to get the permission from the user to use the phone's camera
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // We make sure that the sure that user has given permission to use the camera
  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Please grant camera permissions to app.</Text>
      </View>
    );
  }

  // function to handle the scanned bar code and get data from it
  const handleBarCodeScanned = ({ type, data }) => {
    setScanData(data);
    console.log(`Data: ${data}`);
    console.log(`Type: ${type}`);
    handleSearch(data);
  };

  // Function to verify the data from the QR code against the bookings in the Firestore database
  const handleSearch = (data) => {
    // We need to get the current Time in hours of Int
    // Then based on the parking Lot we will search their reservations
    // If we get the reservation in that time we will show the parking
    // if not we will not show the parking ... or we can get it based on
    // UUID and then compare if the time is in the limit we can open the
    // gate.
    setMessageToDisplay(`Loading...`)
    getTheScannedParkings(data);
  };


// We will check for the booking in the respective bookings collection of the parking lot
  const getTheScannedParkings = async (data) => {
    console.log(`We will find in reservations-${value}`);
    console.log(`For the parking ${data}`);
    // If no parking lot is chosen from the dropdown
    if (value === null) {
      //WE NEED TO ASK THE USE TO CHOOSE A PARKING SLOT..
      setMessageToDisplay(`PLEASE CHOOSE A PARKING LOT !!`)
    }
    // If a parking lot is chosen then we will search the booking in the parking lot
    else {

      // Firestore function to search
      const q = query(
        collection(db, `reservations-${value}`),
        where("parkingID", "==", data)
      );
  
      var arrayOfBookingsObjects = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        arrayOfBookingsObjects.push(doc.data());
      });
  
      if (arrayOfBookingsObjects.length !== 0) {
        console.log(`The Parking is in our System`);
  
        // We will check if the time is right to
        // open the gate.
  
        // NOT USING DATE TO FILTER AS THE USER CAN ONLY SEE TODAY'S PARKINGS
        var unixTimestamp = Date.now();
        var localDate_fromUnix = new Date(unixTimestamp).toLocaleString("en-US", {
          localeMatcher: "best fit",
          timeZoneName: "short",
        });
        var arrayStringTime = localDate_fromUnix.split(" ")
        var currentTimeToConvert = arrayStringTime[1] + " " + arrayStringTime[2];
        var currentHoursIn24hours = convertTime(currentTimeToConvert);

        let bookingTimeToMinus1;
        if (arrayOfBookingsObjects[0].timeInt === 0){
          bookingTimeToMinus1 = 23
        }else{
          bookingTimeToMinus1 = arrayOfBookingsObjects[0].timeInt - 1;
        }
  
        console.log(`current Time : ${parseInt(currentHoursIn24hours)}`)
        console.log(`Booking Time: ${arrayOfBookingsObjects[0].timeInt}`)
        if ((parseInt(currentHoursIn24hours) === bookingTimeToMinus1) ||(parseInt(currentHoursIn24hours) === arrayOfBookingsObjects[0].timeInt)){
          // It is the right time to open the gate.
          setMessageToDisplay(`Initiating Gate Open ...`)
          socket.emit("send_message", { message: "O", room: "16" });
          // socket.emit("send_message", "O");
        }else{
          // The gate cannot be opned at this time as the parking 
          // time is not the current Hour
          setMessageToDisplay(`Parking not booked for the current hour...`)
        }
      }else{
        setMessageToDisplay(`Data not found...`)
      }
    }

  };

  const convertTime = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes, seconds] = time.split(":");
    if (hours === "12") {
      hours = "00";
    }
    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}`;
  };

  const scanAgainPressed = () => {
    setScanData(undefined)
    setMessageToDisplay(``)
  }

  return (
    <SafeArea>
      <View style={styles.container}>
        <BarCodeScanner
          style={StyleSheet.absoluteFillObject}
          onBarCodeScanned={scanData ? undefined : handleBarCodeScanned}
        />
        <View style={styles.pickerView}>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
          />
        </View>
        <View style={styles.spacer}></View>
        <View style={styles.scanAgain}>
          <Text style={styles.messageStyle}>{messageToDisplay}</Text>
          <Button
            mode="contained"
            title="Scan Again"
            onPress={scanAgainPressed}
          />
        </View>
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  pickerView: {
    flex: 0.3,
    judtifySelf: "flex-start",
  },
  spacer: {
    flex: 0.7,
  },
  scanAgain: {
    flexDirection: "column",
  },
  messageStyle: {
    marginLeft: 10,
    marginBottom: 50,
    fontSize: 20,
    color: "#fff",
  },
});
