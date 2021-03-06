import React, { Component } from 'react';
import io from 'socket.io-client';
import './app.css'

class App extends Component {
  state = {
    isConnected:false,
    id:null,
    peeps: [],
    old_messages: [],
    name: "y@zid",
    new_message: "" 
  }
  socket = null

  componentDidMount(){

    this.socket = io('http://codicoda.com:8000');

    this.socket.on('connect', () => {
      this.setState({isConnected:true})
    })

    this.socket.on('disconnect', () => {
      this.setState({isConnected:false})
    })

    /** this will be useful way, way later **/
    this.socket.on('room', (messages) => {
      console.log(messages)
      this.setState({old_messages:messages})
    })



    this.socket.on('pong!',(additionalStuff)=>{
      console.log('testing', additionalStuff)
    })  

    this.socket.emit('whoami'); // Auto Update
    this.socket.on('youare',(answer)=>{
      this.setState({id:answer.id})
    })

    this.socket.on('peeps',(answer)=>{
      this.setState({peeps:answer})
    })
  }

  componentWillUnmount(){
    this.socket.close()
    this.socket = null
    //scrollDown
  
  }
  

  render() {
    return (
      <div className="App">
      <div className="id-ping">
        <div>status: {this.state.isConnected ? 'connected' : 'disconnected'}</div>
        <button className="button" onClick={()=>this.socket.emit('ping!')}>Ping</button>
        <h4> Hello: {this.state.id} </h4>
        <ul> {this.state.peeps ? this.state.peeps.map(x => <li key={x}> {x} </li>) : "null" }</ul>
        </div>

        <div className="old-message">
          <ul> {this.state.old_messages.map((x, i) => <li key={i}> {x.name} - {x.text} </li>)}</ul>

        <input type="text" name="msgbox" onChange={e => this.setState({ new_message: e.target.value })} />
        <button className="button" onClick={()=>this.socket.emit("message", {text: this.state.new_message, id: this.state.id, name: this.state.name})}>Send a message</button>
        </div>

      </div>
    );
  }
}


export default App;
