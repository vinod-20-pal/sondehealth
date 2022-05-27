import logo from './logo.svg';
import React, {useState} from 'react';
import './App.css';
import axios from 'axios';
import qs from 'qs';
import { useReactMediaRecorder } from "react-media-recorder";
import sampleSound from './ahh-sample.wav';
function App() {

  //Using HOOK for Generating Token and userIdentity
  const [tokenField, setTokenField] = useState();
//  const [userIdentity, setuserIdentity] = useState();

  
//Constant Related to Token and  baseURL
  let session_url = "https://djikc8bd1qx0s.cloudfront.net/platform/v1";
  let basicAuth = "MTJsbWtsYmlyYWF1MWdiMXFqbGowdW43bDoxbjBwbWcwcTBzaWNxa2ZnbTVmdGR0ZjFycGtqbzdiajRpNm40ZzRpazNxdjc2M292b2ow";
  let Token = "Vinod";
  let signedURL = "";
  let userIdentity="";
  let filePath = "";

  const { status, startRecording, stopRecording, mediaBlobUrl } =
  useReactMediaRecorder({ audio: true });
if(mediaBlobUrl){
  let mediaURL = mediaBlobUrl;
  console.log(mediaURL);
}

  // Taken Input Feild as a payload for Token Generate 
  const inputTokenField = (event) => {
    console.log(event.target.value)
    setTokenField(event.target.value);
  }
  
  // Generate New Token
  
  const tokenGenerate = () => {

    axios.post(`${session_url}/oauth2/token`,qs.stringify({ 'grant_type': 'client_credentials' }),{
      headers: { 'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
       }
    }).then(function(response) {
      if(response.status==200){
        Token = response.data.access_token;
        console.log(Token);
           }
    }).catch(function(error) {
      console.log('Error on Authentication');
    });
  }

  //Create New User 
  const userData = () => {
    let userDetails = {
      "yearOfBirth": "1900",
      "gender": "male",
      "language":"Hindi"
    }
    axios.post(`${session_url}/users`,
    userDetails,{
      headers:{'Authorization': Token,'Content-Type': 'application/json' }
    }).then(function(response) {
      if(response.status==201){
        userIdentity = response.data.userIdentifier;
        console.log(userIdentity);
      }
      }).catch(function(error) {
      console.log("Error on Authentication");
    })
  }

  // Storage File Signed URL and  File path

  const storage = () => {
    let storageDetail = {
      "fileType": "wav",
      "countryCode": "US",
      "userIdentifier": userIdentity
    }
    axios.post(`${session_url}/storage/files`,
    storageDetail,{
      headers:{'Authorization': Token,'Content-Type': 'application/json' }
    }).then(function(response) {
      if(response.status==201) {
        signedURL = response.data.signedURL;
        filePath = response.data.filePath;
        console.log("Successfully created Signed URL and Filepath");
      }
      else {
        console.log('Unauthorized User Please Generate Token First');
      }
    })
  }

  // Upload Audio File in Binary Format
  const uploadAudio = () => {
    let dataForm = new FormData();
    dataForm.append("audio_file",sampleSound );
    console.log(dataForm);
    //const image = fs.readFile('./ahh-sample.wav');

    axios.put(`${signedURL}`, 
    dataForm, {
      headers:{'Content-Type': 'audio/wave' }
    }).then(function(response) {
      if(response.status==200) {
        console.log("Successfully Upload a Files");
      }
      else {
        console.log("Unauthorized User Please Generate Token First");
      }
    })
  }

  // Checking Scores Comming from Score API

 const Scores = () => {
    let scorePayload = {
      "filePath": filePath,
      "measureName": "emotional-resilience"
    }
    axios.post(`${session_url}/inference/scores`,
    scorePayload,{
      headers:{'Authorization': Token,'Content-Type': 'application/json' }
    }).then(function(response) {
      if(response.status==200) {
        console.log("Successfully Scores Board are Showing");
      }
      else {
        console.log("Unauthorized User Please Generate Token First");
      }
    })
  }

  return (
    <div>
      <h1> Sonde Health Platform </h1>
      <input value={tokenField} onChange={inputTokenField} placeholder="Please write client_credentials"></input>
      <button ml-5 mat-button type="button" onClick={tokenGenerate}>Token Generate</button>
     
          
        
      <button ml-5 mat-button type="button" onClick={userData}>User</button>
      <button ml-5 mat-button type="button" onClick={storage}>Storage Audio</button>

      <p>{status}</p>
      {status && status !== "recording" && (
        <>
        <button
          size="small"
          onClick={startRecording}
          type="danger"
          icon="stop"
          className="margin-left-sm"
          ghost
        >
          Start Recording
        </button>
        {Token}
        </>
      )}
      {status && status === "recording" && (
        <button
          size="small"
          onClick={stopRecording}
          type="danger"
          icon="stop"
          className="margin-left-sm"
          ghost
        >
          Stop Recording
        </button>
      )}
        <audio src={mediaBlobUrl} controls autoPlay />

      <button ml-5 mat-button type="button" onClick={uploadAudio}>uploadFiles</button>
      
      <button ml-5 mat-button type="button" onClick={Scores}>Score</button>
    </div>
      
  );
}

export default App;

