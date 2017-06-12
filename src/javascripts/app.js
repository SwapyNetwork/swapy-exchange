// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

import "../../node_modules/bootstrap/dist/css/bootstrap.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import captionSupply_artifacts from '../../build/contracts/CaptionSupply.json'

// MetaCoin is our usable abstraction, which we'll use  through the code below.
var CaptionSupply = contract(captionSupply_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
var lastInvestimentCounter;
var lastInvestimentReturn;
var lastMonthApplied;
var monthsPayback = 6;

window.App = {
  start: function() {
    var self = this;

    CaptionSupply.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      //get accounts and define the first account
      accounts = accs;
      account = accounts[0];

      App.sendFunds(); //send funds
      App.listToEvents(); //Function to listen for events
    });
  },

  sendFunds: function() {
    CaptionSupply.deployed().then(function(instance) {
      //send ether
      web3.eth.sendTransaction({from: account, to: instance.address, value: web3.toWei(15, "ether"), gas: 4712388});
      console.log(web3.fromWei(web3.eth.getBalance(instance.address).toNumber(), "ether") ); //print the balance
    });
  },

  invest: function() {
    //Function that represents the investment made by the investor to the credit company
    var self = this;

    var _assetsCheckeds = $('input:checkbox:checked').length; //Amount of credit selected
    if ( _.isEqual(_assetsCheckeds, 0) ) {
      swal("No Asset Chosen!", "You did not choose any asset!", "error");
    } else {
      var assetsFormatted = "$ " + (_assetsCheckeds * 5).toString() +".000";
      // Display message to confirm the investment
      swal({
        title: "You are investing " + assetsFormatted,
        text: "Do you confirm your investiment?<br/><br/><b>Investiment:</b> " + assetsFormatted +
        "<br/ ><b>ROI:</b> 10% <i>per annum</i><br /><b>Payback:</b> 6 months",
        html: true,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, confirm!",
        cancelButtonText: "No, cancel!",
        closeOnConfirm: false
      },
      function(){ //confirm button
        App.sendFunds(); //call sendFunds function
        App.listToEvents(); //call listToEvents function

        var _to = accounts[1];

        // Function that realizes the investment passing as parameter the destination address and the amount invested
        CaptionSupply.deployed().then(function(instance) {
          return instance.invest( _to, web3.toWei(_assetsCheckeds, "ether"), { from: accounts[0], gas: 4712388} );
        }).then(function(result) {
          App.listToEvents(); // listen for events

          // Function that obtains the monthly return passing as parameter the identifier of the investment
          CaptionSupply.deployed().then(function(instance) {
            if( !_.isUndefined( lastInvestimentCounter ) ){
              // Pass the last investment identifier
              return instance.expectedReturn( parseInt(lastInvestimentCounter), { from: accounts[0], gas: 4712388} );
            }
          }).then(function(result) {
            // Display message with monthly return
            swal({
              title: "Congratulations!",
              text: "Your investment was successful<br /> Your monthly return is <b>" + lastInvestimentReturn + "</b> ether",
              html: true,
              imageUrl: "app/images/fig.png",
              imageSize: "90x155",
              animation: false,
              confirmButtonText: "Close",
            });

            $("#assetsCheckeds").text( "0.000"); //change text of the total
            $("input:checkbox").prop('checked', false); //uncheck all checkboxes

            App.applyMonthlyReturn(); //Call function to apply monthly return payment

          }).catch(function(error) {
            swal("Error", "Error fetching expected monthly return", "error");
          });

        }).catch(function(err){
          //error to making investment
          swal("Error", "There was an error making investment", "error");
        });
      });
    }
  },

  applyMonthlyReturn: function() {
    //Create an array with the number of months
    _.forEach(Array.from(Array( monthsPayback ).keys()), function(month) {
      //set an interval to execute the payment -> Simulate a job that will trigger every month
      setInterval(function(){
        CaptionSupply.deployed().then(function(instance) {
          if( !_.isUndefined( lastInvestimentCounter ) ){
            // Pass the last investment identifier
            return instance.applyExpectedReturn( parseInt(lastInvestimentCounter), (month + 1), { from: accounts[1], gas: 4712388} );
          }
        }).then(function(result) {
          console.log(result);
        }).catch(function(error) {
          console.log(error);
        });

      }, 10000);

    });
  },

  listToEvents: function() {
    var self = this;
    // listen to events of registerInvestiment
    CaptionSupply.deployed().then(function(instance) {
      instance.registerInvestment().watch(function(error, event){
        lastInvestimentCounter = JSON.parse( JSON.stringify(event) ).args.counter;
        return lastInvestimentCounter;
      });
    });

    // listen to events of registerExpectedReturn
    CaptionSupply.deployed().then(function(instance) {
      instance.registerExpectedReturn().watch(function(error, event){
        var _counter = JSON.parse( JSON.stringify(event) ).args.counter;
        if ( _.isEqual(_counter, lastInvestimentCounter) ) {
          lastInvestimentReturn = JSON.parse( JSON.stringify(event) ).args.monthlyReturn;
          return lastInvestimentReturn;
        }
      });
    });

    // listen to events of registerApplyExpectedReturn
    CaptionSupply.deployed().then(function(instance) {
      instance.registerApplyExpectedReturn().watch(function(error, event){
        var _counter = JSON.parse( JSON.stringify(event) ).args.counter;
        if ( _.isEqual(_counter, lastInvestimentCounter) ) {
          lastMonthApplied = JSON.parse( JSON.stringify(event) ).args.month;
          return lastMonthApplied;
        }
      });
    });
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
