const fs = require("fs");

TrieNode = require('./trieNode');

/**
 * Trie - class representing the trie data structure
 */
class Trie{
    /**
     * constructor - initialises an empty root node
     */
    constructor(){
        this.root = new TrieNode('root');
    }

    /**
     * getter for root node
     */
    get root(){
        return this._root;
    }

    /**
     * setter for root node
     */
    set root(val){
        this._root = val;
    }

    /**
     * addWordIteratively - this function compares each level within the Trie to one of the letters
     * in the word to be stored, and determines whether the word has already been added or not. If the 
     * word has not been added, the function traverses down the Trie for as many levels as has been added
     * in an order corresponding to the word. It then adds the remaining nodes needed with the correct 
     * values, and saves the word to the save.txt file if the save flag is true. It then returns a boolean
     * value indicating whether the word was added successfully or not.
     * @param {string} word - word to be added to the Trie
     * @param {boolean} save - flag indicating whether the word needs to be saved in the save.txt file
     */
    addWordIteratively(word, save){
        let added = false;
        let currentNode = this.root;
        let index = 0;
        while((added==false)&&(index<word.length)){
            if(currentNode.getChild(word[index])==null){
                while(index<word.length){
                    currentNode.addChild(word[index]);
                    currentNode = currentNode.getChild(word[index]);
                    index++;
                }
                currentNode.completeWord = true;
                added = true;
                if(save){
                    fs.appendFile('save.txt', word + "\n", (err)=>{
                        if(err){
                            console.log(err);
                        }
                    });
                }
            }else{
                currentNode = currentNode.getChild(word[index]);
            }
            if((index>=word.length-1)&&(currentNode.completeWord==false)){
                currentNode.completeWord = true;
                added = true;
                if(save){
                    fs.appendFile('save.txt', word + "\n", (err)=>{
                        if(err){
                            console.log(err);
                        }
                    });
                }   
            }
            index++;
        }
        return added;
    };

    /**
     * searchWordIteratively - this function tries to traverse the Trie in an order corresponding to
     * the structure of the word to be searched, and returns a boolean value indicating whether it 
     * was able to or not.
     * @param {string} word - word to be searched for
     */
    searchWordIteratively(word){
        let found = false;
        let currentNode = this.root;
        let index = 0;
        while((found==false)&&(index<word.length)){
            if(currentNode.getChild(word[index])==null){
                return false;
            }
            else{
                currentNode = currentNode.getChild(word[index]);
            }
            if((index==word.length-1)&&(currentNode.completeWord==true)){
                found = true;
            }
            index++;
        }
        return found;
    }
}

module.exports = Trie;