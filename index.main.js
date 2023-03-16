import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { SafeArea } from "./components/SafeArea";
import DropDownPicker from "react-native-dropdown-picker";
import { PickerCustom } from "./components/picker";
import { Provider } from "react-redux";
import store from "./redux/store";

import { collection, query, where, getDocs } from "firebase/firestore";

import { db } from "./utils/firebase.utils";

import { useDispatch, useSelector } from "react-redux";

export default function IndexMain({ parkingLots }) {
//   const parkingLot = useSelector((state) => state.firestoreSlice.parkingLots);
  const [scanData, setScanData] = useState();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);

  const getTheNeededArrayOfObjects = (parkingLots) => {
    setItems(
      parkingLots.map((eachItem) => {
        return {
          label: eachItem.name,
          value: eachItem.uID,
        };
      })
    );
    // console.log(`This is the new array ${JSON.stringify(newArray, null, 2)}`)
    // console.log(`This is the new array ${JSON.stringify(newArray, null, 2)}`)
  };

  useEffect(() => {
    //Re-render
    getTheNeededArrayOfObjects(parkingLots)
    console.log(`We will re-render ${JSON.stringify(parkingLots, null, 2)}`);
  }),
    [parkingLots];

  const handleBarCodeScanned = ({ type, data }) => {
    setScanData(data);
    console.log(`Data: ${data}`);
    console.log(`Type: ${type}`);
  };

  return (
    <SafeArea>
      <View style={styles.container}>
        <BarCodeScanner
          style={StyleSheet.absoluteFillObject}
          onBarCodeScanned={scanData ? undefined : handleBarCodeScanned}
        />
        {/* {scanData && (
          <View>
            <Button
              title="Scan Again?"
              onPress={() => setScanData(undefined)}
            />
          </View>
        )} */}

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
        {/* {scanData && ( */}
        <View style={styles.scanAgain}>
          <Text style={styles.messageStyle}>Hello there</Text>
          <Button
            mode="contained"
            title="Scan Again?"
            onPress={() => setScanData(undefined)}
          />
          {/* )} */}
        </View>
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: "coloumn",
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
  pickerView: {
    flex: 0.3,
    // backgroundColor: "red",
    // backgroundColor: "#fff",
    judtifySelf: "flex-start",
    // alignItems: "center",
    // justifyContent: "center",
  },
  spacer: {
    flex: 0.7,
    // backgroundColor: "red",
    // judtifySelf: "flex-start",
  },
  scanAgain: {
    // backgroundColor: "red",
    flexDirection: "column",
  },
  messageStyle: {
    marginLeft: 10,
    marginBottom: 50,
    fontSize: 20,
    color: "#fff",
  },
});
