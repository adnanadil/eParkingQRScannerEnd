import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import DropDownPicker from "react-native-dropdown-picker";

import { collection, query, where, getDocs } from "firebase/firestore";

import { db } from "../utils/firebase.utils";

import { useDispatch, useSelector } from "react-redux";
import { updateParkingLots } from "../redux/firestoreSlice";

export const PickerCustom = ({parkingLots}) => {


    const dispatch = useDispatch()

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
  };

  useEffect(() => {
    // getAllTheParkingLots()
    // dispatch(updateParkingLots(parkingLots))
    // getTheNeededArrayOfObjects(parkingLots)
    // console.log(`These are the Parking Lots Addu: ${parkingLots}`);
  }, []);

  const getTheNeededArrayOfObjects = (parkingLots) => {
    
    // var newArray = parkingLots.map((eachItem)=> { 
    //     return ({
    //         label: eachItem.name,
    //         value: eachItem.uID
    //     })
    // })
    setModledArray(parkingLots.map((eachItem)=> { 
        return ({
            label: eachItem.name,
            value: eachItem.uID
        })
    }))
    // console.log(`This is the new array ${JSON.stringify(newArray, null, 2)}`)
    // console.log(`This is the new array ${JSON.stringify(newArray, null, 2)}`)
  }

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
//   const [items, setItems] = useState([
//     { label: "Apple", value: "apple" },
//     { label: "Banana", value: "banana" },
//   ]);
  const [items, setItems] = useState(setModledArray);

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
    />
  );
};
