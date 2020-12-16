import * as React from 'react'
import * as Permissions from 'expo-permissions';
import {Text, View, TouchableOpacity, StyleSheet, TextInput} from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner';
import db from '../Config';
import firebase from 'firebase';

export default class BookTScreen extends React.Component{
  constructor(){
      super();
      this.state = {
        hasCameraPermissions : null,
        buttonState: 'normal',
        scanned: false,
        scannedData: '',
        scannedBookId:'',
        scannedStudentID:''
        
      }
  }  

    getCameraPermissions = async () =>{
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        
        this.setState({
          /*status === "granted" is true when user has granted permission
            status === "granted" is false when user has not granted the permission
          */
          hasCameraPermissions: status === "granted",
          buttonState: 'clicked',
          scanned: false
        });
      }
  
      

      handleBarCodeScanned = async({type, data})=>{
        this.setState({
          scanned: true,
          scannedData: data,
          buttonState: 'normal'
        });
      }

      handleTransaction= async()=>{
        var transactionMessage = null;
        db.collection("books").doc(this.state.scannedBookId).get()
        .then((doc)=>{
          var book = doc.data()
          if(book.bookAvailability){
            this.initiateBookIssue();
            transactionMessage = "Book Issued"
          }
          else{
            this.initiateBookReturn();
            transactionMessage = "Book Returned"
          }
        })
    
        this.setState({
          transactionMessage : transactionMessage
        })
      }


      initiateBookIssue(){
         //create a new collection "transaction" 
        //it will have bookId, studentId, trasanctionType , date
        db.collection("transaction").add({
          'studentId' : this.state.scannedStudentID,
          'bookId' : this.state.scannedBookId,
          'transactionType' : "Issue",
          'date' : firebase.firestore.Timestamp.now().toDate()
        })

        // bookAvailability will be false
        db.collection("books").doc(this.state.scannedBookId).update({
          'bookAvail':false
        })


        //student 'noOfBooksIssued' this will increase
        db.collection('student').doc(this.state.scannedStudentID).update({
          'NoOfBooksIssue' : firebase.firestore.FieldValue.increment(1)
        })

       



      }


      initiateBookReturn(){
        // bookAvailability will be false
        db.collection("books").doc(this.state.scannedBookId).update({
          'bookAvail':true
        })
      

        //student 'noOfBooksIssued' this will increase
        db.collection('student').doc(this.state.scannedStudentID).update({
          'NoOfBooksIssue' : firebase.firestore.FieldValue.increment(-1)
        })



        //it will have bookId, studentId, trasanctionType , date
        
        
        //create a new collection "transaction" 
        db.collection("transaction").add({
          'studentId' : this.state.scannedStudentID,
          'bookId' : this.state.scannedBookId,
          'transactionType' : "Return",
          'date' : firebase.firestore.Timestamp.now().toDate()
        })

      }



    render(){
        const hasCameraPermissions = this.state.hasCameraPermissions;
        const scanned = this.state.scanned;
        const buttonState = this.state.buttonState;

        if (buttonState === "clicked" && hasCameraPermissions){
            return(
              <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
              />
            );
          }

          else if (buttonState === "normal"){
            return(
                <View style ={{flex:1, justifyContent:'center', alignText:'center'}}>
                  
                                     
            <Text style={styles.text}>
                {hasCameraPermissions===true ? this.state.scannedData: "Request Camera Permission"}
            </Text> 

              <View style ={{flexDirection :'row', marign : 20, justifyContent:'center'}}>
              <TextInput placeholder="Book ID"
              onChangeText= {text =>this.setState({scannedBookId:text})}
              value={this.state.scannedBookId} style={styles.textInputs}/>

            <TouchableOpacity style={styles.QRbutton} onPress = {this.getCameraPermissions}>
                <Text style={styles.text}>Scan QR Code</Text>
            </TouchableOpacity>

            </View>
            <View style ={{flexDirection :'row', marign : 20, justifyContent:'center'}}>
              <TextInput placeholder="Student ID" 
              onChangeText={text =>this.setState({scannedStudentID:text})}
              value={this.state.scannedStudentID} 
              style={styles.textInputs}/>

            <TouchableOpacity style={styles.QRbutton} onPress = {this.getCameraPermissions}>
                <Text style={styles.text}>Scan QR Code</Text>
            </TouchableOpacity>

            </View>
            <TouchableOpacity style={styles.submitButton} onPress = {this.handleTransaction}>
                <Text style={styles.text}>Submit</Text>
            </TouchableOpacity>

                </View>
            )
          }
        
    }
}
const styles = StyleSheet.create({
    QRbutton: {
        alignSelf: "center",
        backgroundColor: "yellow",
        height: 50,
        width: 100,
        borderTopRightRadius:10,
        borderBottomRightRadius:10,
        marginTop: 20,
        borderColor:'black',
        borderWidth:2
    },
    submitButton: {
        alignSelf: "center",
        backgroundColor: "orange",
        height: 30,
        width: 100,
        borderRadius:10,
        marginTop: 10,
        borderWidth:1
     },
    text: {
        textAlign: 'center',
        marginTop:5,
        fontWeight: 'bold',
        alignSelf:'center'
    },
    textInputs: {
        width: 200,
        height:50,
        borderWidth:2,
        borderTopLeftRadius:10,
        borderBottomLeftRadius:10,
        alignSelf: "center",
        marginTop: 20
    }
})