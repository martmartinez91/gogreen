/*
actor {
  public query func greet(name : Text) : async Text {
    return "Hello everyone my name is Martin, " # name # "!";
  };
};
*/

import RBTree "mo:base/RBTree";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Iter "mo:base/Iter";


actor {

  var question: Text = "Available challenges to choose from";
  var votes: RBTree.RBTree<Text, Nat> = RBTree.RBTree(Text.compare);
  var sum = 0;

  public query func getQuestion() : async Text { 
    question 
  };

// query the list of entries and votes for each one
// Example: 
//      * JSON that the frontend will receive using the values above: 
//      * [["M","0"],["P","0"],["R","0"],["T","0"]]

    public query func getVotes() : async [(Text, Nat)] {
    
        Iter.toArray(votes.entries())
    
    };



 // This method takes an entry to vote for, updates the data and returns the updated hashmap
// Example input: vote("Motoko")
// Example: 
//      * JSON that the frontend will receive using the values above: 
//      * [["Motoko","1"],["Python","0"],["Rust","0"],["TypeScript","0"]]
    
  public func vote(entry: Text) : async [(Text, Nat)] {

    //Check if the entry already has votes.
    //Note that "votes_for_entry" is of type ?Nat. This is because: 
    // * If the entry is in the RBTree, the RBTree returns a number.
    // * If the entry is not in the RBTree, the RBTree returns `null` for the new entry.
    let votes_for_entry :?Nat = votes.get(entry);
    
    //Need to be explicit about what to do when it is null or a number so every case is taken care of
    let current_votes_for_entry : Nat = switch votes_for_entry {
      case null 0;
      case (?Nat) Nat;
    };

    //once we have the number of votes, update the votes for the entry
    votes.put(entry, current_votes_for_entry + 1);

    //Return the number of votes as an array (so frontend can display it)
    Iter.toArray(votes.entries())
  };

  public func resetVotes() : async [(Text, Nat)] {
      votes.put("Bottle", 0);
      votes.put("Recycle bin", 0);
      votes.put("Electric car", 0);
      votes.put("Vegetarian food", 0);
      Iter.toArray(votes.entries())
  };

  public func resetInd() : async [(Text, Nat)] {
      votes.put("Electric car", 0);
      Iter.toArray(votes.entries())
  };

};