import React from "react";
import ReactHLS from 'react-hls';
import desktop from './desktop.css';
import phone from './phone.css';
import MQ from 'react-responsive';
import axios from 'axios';
const baseUrl = {
  hin: "https://cors-anywhere.herokuapp.com/https://live12.akt.hotstar-cdn.net/hls/live/2003697/ipl2019/hin/fulldvrm0",
  eng: "https://cors-anywhere.herokuapp.com/https://live11.akt.hotstar-cdn.net/hls/live/2003689/ipl2019/eng/fulldvrm0"
};
const breakpoints = {
  desktop: '(min-width: 1025px)',
  tablet: '(min-width: 768px) and (max-width: 1024px)',
  phone: '(max-width: 767px)',
 };
 const d = new Date();
const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
let month = monthNames[d.getMonth()].toLowerCase();
let date = d.getDate();
let matchNo =1;
if (d.getHours() >=20){
    matchNo = 2;
}
if (d.getHours() <1){
    date--;
    matchNo = 2;
}
if (date<10){
    date='0'+date;
}
date = '04';
month = 'april'
matchNo = 1;
class App extends React.Component {
  constructor(){
    super();
    this.load = this.load.bind(this);
    this.quality = React.createRef();
    this.language = React.createRef();
    this.getItems = this.getItems.bind(this);
    this.state = {
      url: '',
      updated: 0
    }
  }
  componentDidMount() {
    this.timer = setInterval(()=> this.getItems(), 5000);
  }
  
  componentWillUnmount() {
    this.timer = null; // here...
  }
  getItems() {
    axios.get(this.state.url)
  .then((response) => {
      axios.post('/save',{
        response: response.data
      })
      .then( () => {
        console.log('saved');
        if(this.state.prevUrl !== this.state.url)
        {
          console.log('rerendered');
          this.setState((state) => ({
              prevUrl: state.url
          }))
        }
    });
  });
  }
  load(e){
      e.preventDefault();
    this.setState((state) => ({
        prevUrl: state.url,
        url: baseUrl[this.language.current.value]+matchNo + date + month + "2019/master_"+this.quality.current.value+".m3u8",
    }));
  }
  render() {
    return (
      <div>
        <MQ query={breakpoints.desktop}>
          <div className='sideBar'>
          <label className='label'>Select Language</label>
                <select className={'select-css'} name="language" ref={this.language} defaultValue='eng'>
                  <option value='eng'>English</option>
                  <option value='hin'>Hindi</option>
                </select>
              <label className={'label'}>Select Quality</label>
              <select className={'select-css'} name="quality" ref={this.quality} defaultValue='1'>
                <option value='1'>1</option>
                <option value='2'>2</option>
                <option value='3'>3</option>
                <option value='4'>4</option>
                <option value='5'>5</option>
              </select>
              <button className={'button'} onClick={this.load}>LOAD</button>
          </div>
          <div className={'mainBody'}>
            <ReactHLS width={800} height={600} url={'/watch.m3u8'} autoplay/>
          </div>
        </MQ>
        <MQ query={breakpoints.phone}>
          <div className={phone.mainBody}>
            <ReactHLS width={window.innerWidth} height={200} url={this.state.url} autoplay/>
          </div>
          <div className={phone.sideBar}>
          <label className={phone.label}>Select Language</label>
                <select className={desktop['select-css']} name="language" ref={this.language} defaultValue='eng'>
                  <option value='eng'>English</option>
                  <option value='hin'>Hindi</option>
                </select>
              <label className={phone.label}>Select Quality</label>
              <select className={phone['select-css']} name="quality" ref={this.quality} defaultValue='1'>
                <option value='1'>1</option>
                <option value='2'>2</option>
                <option value='3'>3</option>
                <option value='4'>4</option>
                <option value='5'>5</option>
              </select>
              <button className={phone.button} onClick={this.load}>LOAD</button>
          </div>
        </MQ>
      </div>
    );
  }
}
export default App;
