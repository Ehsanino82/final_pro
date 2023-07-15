import React, { Component } from 'react'

function setUserInCookie(user) {
    const expirationDate = new Date();
    // expire after 7 days
    expirationDate.setDate(expirationDate.getDate() + 7);
    const cookieValue = encodeURIComponent(user);
    const cookieName = "user";
    const cookieOptions = {
        expires: expirationDate.toUTCString(),
        path: "/"
    };
    document.cookie = `${cookieName}=${cookieValue}; ${Object.entries(cookieOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join("; ")}`;
}

function getUserCookie() {

    const cookieName = "user=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    // find the value with key: "user"
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.startsWith(cookieName)) {
            return cookie.substring(cookieName.length);
        }
    }
    return null;
}

export default class ProfilePage extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            user : JSON.parse(getUserCookie()),
            name  : this.user.username,
            money : this.user.credit,
            newcharge : 10000,
            useotherval : false,
            userinput : ""
        }
        
    }

    
    handleCharge = (event) => {
        
        this.setState({newcharge : event.target.value})

        if (event.target.value == 0) {
            this.setState({useotherval : true})

        } else{
            this.setState({useotherval : false})
        }
    }

    handleinput = event => {
        this.setState({userinput : event.target.value})
    }

    charge = () =>{
        //send to back
        console.log("clicked");
        let data = {
            username: this.state.name,
            credit: parseInt(this.state.userinput),
        };

        fetch('http://localhost:8000/add-credit/', {
          method: 'POST',
          body: JSON.stringify(data),
        })
        .then(response => {
            if (response != null) {
                console.log(response)
                return response.json(); // Extract the response body as JSON
            } else {
                throw new Error('Failed to receive response from Go server');
            }
        })
        .then(data => {
            alert(data.message);
            if (data.credit > 0) {
                let user = {
                    username: user.username,
                    password: user.password,
                    credit: user.credit + data.credit,
                };
                setUserInCookie(user);
                this.setState({user: user});
            }
        })
    }

  render() {

    return (
       
      <div  className = "profile content-around">
        <h1 className='bg-gray-300 bg-opacity-50  rounded-lg pt-5'>
            welcome {this.state.name} have a nice trip!
        </h1>
        <p className='bg-gray-300 bg-opacity-50  rounded-lg pt-5'>
            your money is  {this.state.money}
        </p>

        <label> charge your account</label>
        <br></br>
        <label className='bg-gray-300 bg-opacity-50  rounded-lg pt-5'> amount to charge</label>

        <select onChange={this.handleCharge} value={this.state.newcharge} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value='10000'>1 000 000</option>
            <option value='50000'>5 000 000</option>
            <option value='100000'>10 000 000</option>
            <option value='0'>other amount</option>
        </select>

        { this.state.useotherval &&
        <>
        <label>
         how much you want to charge:
        </label>

        <input type="text" value={this.state.userinput} onChange={this.handleinput} className= "bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500">

        </input>
        </>
        }   

        

        <button class="btn-primary" onClick={this.charge}>
        charge
        </button>

  
      </div>
    )
  }
}
