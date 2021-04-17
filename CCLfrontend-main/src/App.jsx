import React, { useState } from "react";
import fileDownload from 'js-file-download';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import "./App.css";
import Axios from "axios";

function App() {
  const [isLoading, setLoad] = useState(0);
  const [name, setName] = useState();
  const [file, setFile] = useState(null);
  const [resimg, setImg] = useState(null);
  const [ipSize, setInputSize] = useState(null)
  const [avifQuality, setAvifQuality] = useState(50);
  const [pngQuality, setPngQuality] = useState(50);
  const [jpgQuality, setJpgQuality] = useState(50);
  const [opSize, setOutputSize] = useState(null);
  const [fileName, setFileName] = useState(null)



  const send = event => {
    setLoad(1)
    setImg(null)
    const data = new FormData();
    data.append("name", name);
    data.append("file", file);
    data.append("quality",avifQuality);

    Axios.post("http://localhost:9000/upload", data)
      .then(res => {
        console.log(res)
        setImg(res.data.file)
        setFileName(res.data.filename)
        setOutputSize(res.data.size)
        setLoad(0)
      })
      .catch(err => console.log(err));
  };


  const jpgCompress = () => {
    setImg(null)
    const data = new FormData();
    data.append("name", name);
    data.append("file", file);
    data.append("quality", jpgQuality);

    Axios.post("http://localhost:9000/jpgCompress", data)
      .then(res => {
        console.log(res)
        setImg(res.data.file)
        setFileName(res.data.filename)
        setOutputSize(res.data.size)
        setLoad(0)
      })
      .catch(err => console.log(err));
  }


  const toPng = () => {
    setImg(null)
    const data = new FormData();
    data.append("name", name);
    data.append("file", file);
    data.append("quality",pngQuality)

    Axios.post("http://localhost:9000/toPng", data)
      .then(res => {
        console.log(res)
        setImg(res.data.file)
        setFileName(res.data.filename)
        setOutputSize(res.data.size)
        setLoad(0)
      })
      .catch(err => console.log(err));
  }

  const downloadFile = () => {
    const data = new FormData();
    data.append("name", fileName);
    data.append("file", file);

    /* Axios.get(`http://localhost:9000/download/${fileName}`, data)
      .then(res => {
        console.log(res)
        setLoad(0)
      })
      .catch(err => console.log(err)); */

    window.open(`http://localhost:9000/download/${fileName}`)

  }

  const getPngQuality = () => {
    setPngQuality(document.getElementById('myRangepng').value)
    }

    const getJpgQuality = () => {
      setJpgQuality(document.getElementById('myRangejpg').value)
      }

  const getAvifQuality = () => {
  setAvifQuality(document.getElementById('myRangeavif').value)
  }

  function openCity(evt, cityName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("city");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
      tablinks[i].className = tablinks[i].className.replace("is-active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.firstElementChild.className += " is-active";
  }


  return (
    <div className="App">
      <div className="App-header container is-fullhd-desktop is-fullhd-mobil">
        <div className="columns">
          <div className="column is-one-third" style={{ margin: '10px', padding: '10px', justifyContent: 'center', alignItems: 'center', display: 'flex', height: '80vh' }}>

            <form action="#" >
              <div className="field">
                <label htmlFor="file" className="is-size-2 has-text-dark has-text-weight-bold" style={{ border: '2px solid black', padding: '5px', cursor: 'pointer', borderStyle: 'dashed' }}>Browse File</label>
                <br />
                <input
                  type="file"
                  id="file"
                  accept=".jpg"
                  style={{ display: 'none' }}
                  onChange={event => {
                    const file = event.target.files[0];
                    setFile(file);
                    let sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
                    setInputSize(sizeInMB)
                    console.log(file)
                  }}
                />
              </div>
              <p className="is-size-6 has-text-dark has-text-weight-bold">{file !== null ? `${file.name} - ${ipSize}mb` : null} </p>
             
              <div className="hallticket-tabs" style={{ marginTop: '20px', marginBottom: '0px' }}>
                <a href="javascript:void(0)" onClick={(event) => { openCity(event, 'myhallticket') }}>
                  
                  <div className="w3-third tablink w3-bottombar w3-padding is-active"><button className="button">Avif</button></div>
                </a>
                <a href="javascript:void(0)" onClick={(event) => { openCity(event, 'kthallticket') }}>
                  <div className="w3-third tablink w3-bottombar  w3-padding"><button className="button">Png</button></div>
                </a>
                <a href="javascript:void(0)" onClick={(event) => { openCity(event, 'compress') }}>
                  <div className="w3-third tablink w3-bottombar  w3-padding"><button className="button">Compress</button></div>
                </a>
              </div>
          <br/>
              <div className=" w3-container city box" id="kthallticket" style={{ display: 'none' }}>
              <label htmlFor="" className="label" >Quality</label>
              <input class="slider is-danger" onChange={getPngQuality}  id="myRangepng" step="1" min="0" max="100" type="range"/>
                <p className="help has-text-dark">{pngQuality}</p>
              <button className="button  is-success is-medium is-fullwidth "  onClick={toPng}>Convert to PNG</button>
                    </div>

              <div className=" w3-container city box" id="myhallticket" style={{ display: 'block' }}>
              <label htmlFor="" className="label" >Quality</label>
              <input class="slider is-danger" onChange={getAvifQuality}  id="myRangeavif" step="1" min="0" max="100" type="range"/>
                <p className="help has-text-dark">{avifQuality}</p>
              <button className={`button is-medium is-fullwidth  is-success ${isLoading === 1 ? 'is-loading' : ''}`} onClick={send}>Convert to AVIF</button>
                    </div>
                   
               
                    <div className=" w3-container city box" id="compress" style={{ display: 'none' }}>
                    <label htmlFor="" className="label" >Quality</label>
              <input class="slider is-danger" onChange={getJpgQuality}  id="myRangejpg" step="1" min="1" max="100" type="range"/>
              <p className="help has-text-dark">{jpgQuality}</p>
                    <button className="button  is-success is-medium is-fullwidth " onClick={jpgCompress}>Compress</button>
                    </div>

            
              <br />
             
             

             
              {/*  <div className="field">
            <label htmlFor="" className="label" >Saturation</label>
              <input class="slider is-danger" onChange={getVal}  id="myRange" step="1" min="0" max="10" type="range"/>
                <p className="help has-text-dark">{satVal}</p>
            </div> */}
            </form>


          </div>

          <div className="column">
            <div className="section">
              {resimg !== null ? (<div className="box" >
                <img src={`${resimg}?` + new Date().getTime()} height="100px"></img>
                <p>Size: {opSize}mb</p>
                <button className="button is-outlined is-success" onClick={downloadFile}>Download</button>
              </div>) : '😁'}
            </div>

          </div>
        </div>

      </div>













    </div>
  );
}

export default App;