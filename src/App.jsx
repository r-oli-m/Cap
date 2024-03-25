import { useState } from 'react'
import './App.css'
import APIForm from './components/APIForm';
import Gallery from './components/Gallery';


const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;
function App() {
  const [count, setCount] = useState(0)
  const [currentImage, setCurrentImage] = useState(null)
  const [prevImages, setPrevImages] = useState([]);
  const [quota, setQuota] = useState(null);


  const [inputs, setInputs] = useState({
    url: '',
    format: '',
    no_ads: "",
    full_page: "",
    width: "",
    height: "",
  });
  const submitForm = () => {
    let defaultValues = {
      format: "jpeg",
      no_ads: "true",
      full_page: "false",
      width: "1920",
      height: "1080"
    }
    if (inputs.url === "" || inputs.url === " ") {
      alert("You forgot to submit a URL!")
    }
    else {
      for (const [key, value] of Object.entries(inputs)) {
        if (value === "") {
          inputs[key] = defaultValues[key]
        }
      }
      makeQuery()
    }
  }
  const makeQuery = () => {
    let wait_until = "network_idle";
    let response_type = "json";
    let fail_on_status = "400%2C404%2C500-511";
    let fullURL = inputs.url;
    //if url does not have https, add it
    if (!inputs.url.includes("https://")) {
      let url_starter = "https://";
      let fullURL = url_starter + inputs.url;
    }
    let query = `https://api.apiflash.com/v1/urltoimage?access_key=${ACCESS_KEY}&url=${fullURL}&format=${inputs.format}&width=${inputs.width}&height=${inputs.height}&no_cookie_banners=${inputs.no_cookie_banners}&no_ads=${inputs.no_ads}&wait_until=${wait_until}&response_type=${response_type}&fail_on_status=${fail_on_status}`;
    callAPI(query).catch(console.error);
  }
  const reset = () => {
    setInputs({
      url: '',
      format: '',
      no_ads: "",
      full_page: "",
      width: "",
      height: ""
    });
  }
  const getQuota = async () => {
    const response = await fetch("https://api.apiflash.com/v1/urltoimage/quota?access_key=" + ACCESS_KEY);
    const result = await response.json();

    setQuota(result);
    console.log(result)
  }
  const callAPI = async (query) => {
    const response = await fetch(query);
    const json = await response.json();
    console.log(json)
    if (json.url === null) {
      alert("There was an error with your request. Please try again.")
    }
    else {
      setCurrentImage(json.url)
      setPrevImages((images) => [...images, json.url])
      reset()
      getQuota()
    }
  }
  return (
    <div className="whole-page">
      <h1>Build your own screenshot </h1>
      <APIForm
        inputs={inputs}
        handleChange={(e) =>
          setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value.trim(),
          }))
        }
        onSubmit={submitForm}
      />
      {quota ? (
        <p className="quota">
          {" "}
          Remaining API calls: {quota.remaining} out of {quota.limit}
        </p>
      ) : (
        <p></p>
      )}
      {currentImage ? (
        <img
          className="screenshot"
          src={currentImage}
          alt="Screenshot returned"
        />
      ) : (
        <div> </div>
      )}
      <div className="container">
        <h3> Current Query Status: </h3>
        <p>
          https://api.apiflash.com/v1/urltoimage?access_key=ACCESS_KEY
          <br></br>
          &url={inputs.url} <br></br>
          &format={inputs.format} <br></br>
          &width={inputs.width} <br></br>
          &height={inputs.height}<br></br>
          &full_page={inputs.full_page}<br></br>
          &no_ads={inputs.no_ads}<br></br>
        </p>
        <Gallery images={prevImages} />

      </div>

      <br></br>
    </div>
  );
}

export default App