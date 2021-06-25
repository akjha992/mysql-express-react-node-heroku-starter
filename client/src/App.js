import React from "react";
import axios from "axios";
class App extends React.Component {
  constructor(){
    super();
    this.state={users: []};
  }
  componentDidMount(){
    axios.get('/users').then(resp=>{
      console.log(resp.data);
      this.setState({users: resp.data});
    });
  }
  render() {
    return (
      <div>
        <h1>User List</h1>
        {this.state.users.map(user=>(<h2>{user.userName}</h2>))}
      </div>
    );
  }
}
export default App;
