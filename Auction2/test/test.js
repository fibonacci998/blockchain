let Auction = artifacts.require('./Auction.sol');
let auctionInstance;
contract('Test Register', function (accounts) {
  //accounts[0] is the default account
  describe('Contract deployment', function () {
    it('Contract deployment', function () {
      //Fetching the contract instance of our smart contract
      return Auction.deployed().then(function (instance) {
        //We save the instance in a global variable and all smart contract functions are called using this
        auctionInstance = instance;
        assert(
          auctionInstance !== undefined,
          'Auction contract should be defined'
        );
      });
    });
    it('Initial rule with corrected startingPrice and minimumStep', function () {
      //Fetching the rule of Auction
      return auctionInstance.rule().then(function (rule) {
        //We save the instance in a global variable and all smart contract functions are called using this
        assert(rule !== undefined, 'Rule should be defined');
        assert.equal(rule[0], 50, 'Starting price should be 50');
        assert.equal(rule[1], 5, 'Minimum step should be 5');
      });
    });
  });

  describe('REGISTER', function () {
    it('Only Auctioneer can register bidders (positive)', function () {
      return auctionInstance.register(accounts[1], 100, { from: accounts[0] })
        .then(function (result) {
          throw ("Completed to register account from account auctioneer")
        }).catch(function (e) {
          if (e === "Completed to register account from account auctioneer") {
            assert(true);
          } else {
            assert(false);
          }
        })
    });
    it('Only Auctioneer can register bidders (negative)', function () {
      return auctionInstance.register(accounts[2], 100, { from: accounts[1] })
        .then(function (result) {
          throw ("Completed to register account from account auctioneer")
        }).catch(function (e) {
          if (e === "Completed to register account from account auctioneer") {
            assert(false);
          } else {
            assert(true);
          }
        })
    });

    it('When register, the account address and the number of tokens need to be inputted. (negative)', function () {
      return auctionInstance.register(accounts[4], { from: accounts[0] })
        .then(function (result) {
          throw ("Register completed")
        }).catch(function (e) {
          if (e === "Register completed") {
            assert(false);
          } else {
            assert(true);
          }
        })
    })

    it('When register, the account address and the number of tokens need to be inputted. (positive)', function () {
      return auctionInstance.register(accounts[4], 100, { from: accounts[0] })
        .then(function (result) {
          throw ("Register completed")
        }).catch(function (e) {
          if (e === "Register completed") {
            assert(true);
          } else {
            assert(false);
          }
        })
    })


    it('This action is only available in Created State (positive)', function () {
      return auctionInstance.register(accounts[2], 100, { from: accounts[0] })
        .then(function (result) {
          throw ("Completed to register account at Created State")
        }).catch(function (e) {
          if (e === "Completed to register account at Created State") {
            assert(true);
          } else {
            assert(false);
          }
        })
    })

    it('This action is only available in Created State (negative)', function () {
      return auctionInstance.startSession()
        .then(function () {
          return auctionInstance.register(accounts[3], 100, { from: accounts[0] })
        }).then(function (result) {
          throw ("Completed to register account at Created State");
        }).catch(function (e) {
          if (e === "Completed to register account at Created State") {
            assert(false);
          } else {
            assert(true);
          }
        })
    })
  })

});
describe('START THE SESSION', function (accounts) {
  contract('Start the session by auctioneer and not auctioneer', function (accounts) {

    it('Only Auctioneer can start the session (positive)', function () {
      return Auction.deployed({ from: accounts[0] })
        .then(function (instance) {
          auctionInstanceTemp = instance;
        }).then(function () {
          return auctionInstanceTemp.startSession({ from: accounts[0] })
        }).then(function () {
          throw ("Start session completed")
        }).catch(function (e) {
          if (e === "Start session completed") {
            assert(true);
          } else {
            assert(false);
          }
        });
    })

    it('Only Auctioneer can start the session (negative)', function () {
      return Auction.deployed({ from: accounts[0] })
        .then(function (instance) {
          auctionInstanceTemp = instance;
        }).then(function () {
          return auctionInstanceTemp.startSession({ from: accounts[1] })
        }).then(function () {
          throw ("Start session completed")
        }).catch(function (e) {
          if (e === "Start session completed") {
            assert(false);
          } else {
            assert(true);
          }
        });

    })
  });
  contract('Start the session in right state and wrong state', function (accounts) {
    it('This action is only available in Created State (positve)', function () {
      return Auction.deployed()
        .then(function (instance) {
          auctionInstanceTemp = instance;
        }).then(function () {
          return auctionInstanceTemp.startSession()
        }).then(function () {
          throw ("Start session completed")
        }).catch(function (e) {
          if (e === "Start session completed") {
            assert(true);
          } else {
            assert(false);
          }
        });
    })

    it('This action is only available in Created State (negative)', function () {
      return auctionInstanceTemp.startSession()
        .then(function () {
          throw ("Start session completed")
        }).catch(function (e) {
          if (e === "Start session completed") {
            assert(false);
          } else {
            assert(true);
          }
        })
    })
  })
})

describe('BID', function (accounts) {
  contract('Test person who can bid', function (accounts) {

    it('All the Bidders can bid (negative)', function () {
      return Auction.deployed()
        .then(function (instance) {
          auctionInstanceTemp = instance;
        }).then(function () {
          return auctionInstanceTemp.register(accounts[1], 100, { from: accounts[0] })
        }).then(function () {
          return auctionInstanceTemp.startSession({ from: accounts[0] })
        }).then(function () {
          return auctionInstanceTemp.bid(60, { from: accounts[0] })
        }).then(function (result) {
          throw ("Completed to register account from account not auctioneer")
        }).catch(function (e) {
          if (e === "Completed to register account from account not auctioneer") {
            assert(false);
          } else {
            assert(true);
          }
        });
    });

    it('All the Bidders can bid (positive)', function () {
      return auctionInstanceTemp.bid(60, { from: accounts[1] })
        .then(function (result) {
          throw ("Completed to register account from account not auctioneer")
        }).catch(function (e) {
          if (e === "Completed to register account from account not auctioneer") {
            assert(true);
          } else {
            assert(false);
          }
        });
    });
  });
  contract('Only can bid in started stage', function (accounts) {
    let auctionInstanceTemp
    it('This action is only available in Started State (negative)', function () {
      return Auction.deployed()
        .then(function (instance) {
          auctionInstanceTemp = instance;
        }).then(function () {
          return auctionInstanceTemp.register(accounts[1], 100, { from: accounts[0] })
        }).then(function () {
          return auctionInstanceTemp.bid(60, { from: accounts[1] })
        }).then(function (result) {
          throw ("Completed to bid")
        }).catch(function (e) {
          if (e === "Completed to bid") {
            assert(false);
          } else {
            assert(true);
          }
        });
    });

    it('This action is only available in Started State (positive)', function () {
      return auctionInstanceTemp.startSession()
        .then(function () {
          return auctionInstanceTemp.bid(60, { from: accounts[1] })
            .then(function (result) {
              throw ("Completed to register account from account auctioneer")
            }).catch(function (e) {
              if (e === "Completed to register account from account auctioneer") {
                assert(true);
              } else {
                assert(false);
              }
            });
        })
    });
  })

  contract('Input price must be inputted', function (accounts) {
    let auctionInstanceTemp
    it('The next price must be inputted (negative)', function () {
      return Auction.deployed()
        .then(function (instance) {
          auctionInstanceTemp = instance;
        }).then(function () {
          return auctionInstanceTemp.register(accounts[1], 100, { from: accounts[0] })
        }).then(function () {
          return auctionInstanceTemp.startSession()
        }).then(function () {
          return auctionInstanceTemp.bid({ from: accounts[1] })
        }).then(function (result) {
          throw ("Completed to bid")
        }).catch(function (e) {
          if (e === "Completed to bid") {
            assert(false);
          } else {
            assert(true);
          }
        });
    });

    it('The next price must be inputted (positive)', function () {
      return auctionInstanceTemp.bid(60, { from: accounts[1] })
        .then(function (result) {
          throw ("Completed to bid")
        }).catch(function (e) {
          if (e === "Completed to bid") {
            assert(true);
          } else {
            assert(false);
          }
        });
    });
  })

  contract('Input price must be higher than rule current + step', function (accounts) {
    let auctionInstanceTemp
    it('The next price must higher than the latest price plus the minimum step (negative)', function () {
      return Auction.deployed()
        .then(function (instance) {
          auctionInstanceTemp = instance;
        }).then(function () {
          return auctionInstanceTemp.register(accounts[1], 100, { from: accounts[0] })
        }).then(function () {
          return auctionInstanceTemp.startSession()
        }).then(function () {
          return auctionInstanceTemp.bid(53, { from: accounts[1] })
        }).then(function (result) {
          throw ("Completed to bid")
        }).catch(function (e) {
          if (e === "Completed to bid") {
            assert(false);
          } else {
            assert(true);
          }
        });
    });

    it('The next price must higher than the latest price plus the minimum step (positive)', function () {
      return auctionInstanceTemp.bid(60, { from: accounts[1] })
        .then(function (result) {
          throw ("Completed to bid")
        }).catch(function (e) {
          if (e === "Completed to bid") {
            assert(true);
          } else {
            assert(false);
          }
        });
    });
  })
})
describe('ANNOUNCE', function (accounts) {
  contract('Only the Auctioneer can Announce', function (accounts) {
    let auctionInstanceTemp
    it('Only the Auctioneer can Announce (negative)', function () {
      return Auction.deployed()
        .then(function (instance) {
          auctionInstanceTemp = instance
        }).then(function () {
          return auctionInstanceTemp.register(accounts[1], 100, { from: accounts[0] })
        }).then(function () {
          return auctionInstanceTemp.startSession()
        }).then(function () {
          return auctionInstanceTemp.bid(60, { from: accounts[1] })
        }).then(function () {
          return auctionInstanceTemp.announce({ from: accounts[1] })
        }).then(function () {
          throw ('Anounce completed')
        }).catch(function (e) {
          if (e === 'Anounce completed') {
            assert(false);
          } else {
            assert(true);
          }
        })
    })

    it('Only the Auctioneer can Announce (positive)', function () {
      return auctionInstanceTemp.announce({ from: accounts[0] })
        .then(function () {
          throw ('Anounce completed')
        }).catch(function (e) {
          if (e === 'Anounce completed') {
            assert(true);
          } else {
            assert(false);
          }
        })
    })
  })

  contract('This action is only available in Started State', function (accounts) {
    let auctionInstanceTemp
    it('This action is only available in Started State (negative)', function () {
      return Auction.deployed()
        .then(function (instance) {
          auctionInstanceTemp = instance
        }).then(function () {
          return auctionInstanceTemp.register(accounts[1], 100, { from: accounts[0] })
        }).then(function () {
          return auctionInstanceTemp.announce({ from: accounts[1] })
        }).then(function () {
          throw ('Anounce completed')
        }).catch(function (e) {
          if (e === 'Anounce completed') {
            assert(false);
          } else {
            assert(true);
          }
        })
    })

    it('This action is only available in Started State (positive)', function () {
      return auctionInstanceTemp.startSession()
        .then(function () {
          return auctionInstanceTemp.announce({ from: accounts[0] })
            .then(function () {
              throw ('Anounce completed')
            }).catch(function (e) {
              if (e === 'Anounce completed') {
                assert(true);
              } else {
                assert(false);
              }
            })
        })
    })
  })

  contract('After 3 times (4th call of this action), the session will end', function (accounts) {
    let auctionInstanceTemp;
    it('Only the Auctioneer can Announce (negative)', function () {
      return Auction.deployed()
        .then(function (instance) {
          auctionInstanceTemp = instance
        }).then(function () {
          return auctionInstanceTemp.register(accounts[1], 100, { from: accounts[0] })
        }).then(function () {
          return auctionInstanceTemp.startSession()
        }).then(function () {
          return auctionInstanceTemp.bid(60, { from: accounts[1] })
        }).then(function () {
          return auctionInstanceTemp.announce({ from: accounts[0] })
        }).then(function () {
          return auctionInstanceTemp.state()
        }).then(function (result) {
          assert.notEqual(result.toString(), '2', 'State is Closing')
        })
    })
    it('Only the Auctioneer can Announce (positive)', function () {
      return auctionInstanceTemp.announce()
        .then(function () {
          return auctionInstanceTemp.announce()
        }).then(function () {
          return auctionInstanceTemp.announce()
        }).then(function () {
          return auctionInstanceTemp.state()
        }).then(function (result) {
          assert.equal(result.toString(), '2', 'State is Closing')
        })
    })
  })
})
describe('GET BACK THE DEPOSIT', function (accounts) {
  contract('All the Bidders (except the Winner) can Get back the deposit', function (accounts) {
    let auctionInstanceTemp
    it('All the Bidders (except the Winner) can Get back the deposit (negative)', function () {
      return Auction.deployed()
        .then(function (instance) {
          auctionInstanceTemp = instance
        }).then(function () {
          return auctionInstanceTemp.register(accounts[1], 100, { from: accounts[0] })
        }).then(function () {
          return auctionInstanceTemp.register(accounts[2], 100, { from: accounts[0] })
        }).then(function () {
          return auctionInstanceTemp.startSession()
        }).then(function () {
          return auctionInstanceTemp.bid(60, { from: accounts[1] })
        }).then(function () {
          return auctionInstanceTemp.bid(70, { from: accounts[2] })
        }).then(function () {
          return auctionInstanceTemp.announce({ from: accounts[0] })
        }).then(function () {
          return auctionInstanceTemp.announce({ from: accounts[0] })
        }).then(function () {
          return auctionInstanceTemp.announce({ from: accounts[0] })
        }).then(function () {
          return auctionInstanceTemp.announce({ from: accounts[0] })
        })
        .then(function () {
          return auctionInstanceTemp.getDeposit({ from: accounts[0] })
        }).then(function () {
          throw ('Get deposit completed')
        }).catch(function (e) {
          if (e === 'Get deposit completed') {
            assert(false);
          } else {
            assert(true);
          }
        })
    })

    it('All the Bidders (except the Winner) can Get back the deposit (positive)', function () {
      return auctionInstanceTemp.getDeposit({ from: accounts[1] })
        .then(function () {
          throw ('Get deposit completed')
        }).catch(function (e) {
          if (e === 'Get deposit completed') {
            assert(true);
          } else {
            assert(false);
          }
        })
    })
  })

  contract('This action is only available in Closing State', function (accounts) {
    let auctionInstanceTemp;
    it('This action is only available in Closing State (negative)', function () {
      return Auction.deployed()
        .then(function (instance) {
          auctionInstanceTemp = instance
        }).then(function () {
          return auctionInstanceTemp.register(accounts[1], 100, { from: accounts[0] })
        }).then(function () {
          return auctionInstanceTemp.register(accounts[2], 100, { from: accounts[0] })
        }).then(function () {
          return auctionInstanceTemp.startSession()
        }).then(function () {
          return auctionInstanceTemp.bid(60, { from: accounts[1] })
        }).then(function () {
          return auctionInstanceTemp.bid(70, { from: accounts[2] })
        }).then(function () {
          return auctionInstanceTemp.announce({ from: accounts[0] })
        }).then(function () {
          return auctionInstanceTemp.announce({ from: accounts[0] })
        }).then(function () {
          return auctionInstanceTemp.announce({ from: accounts[0] })
        }).then(function () {
          return auctionInstanceTemp.getDeposit({ from: accounts[1] })
        }).then(function () {
          throw ('Get deposit completed')
        }).catch(function (e) {
          if (e === 'Get deposit completed') {
            assert(false);
          } else {
            assert(true);
          }
        })
    })

    it('This action is only available in Closing State (positive)', function(){
      return auctionInstanceTemp.announce({ from: accounts[0] })
      .then(function(){
        auctionInstanceTemp.getDeposit({ from: accounts[1] })
      }).then(function(){
        throw('Get deposit completed')
      }).catch(function(e){
        if (e ==='Get deposit completed'){
          assert(true);
        }else{
          assert(false);
        }
      })
    })
  })

})