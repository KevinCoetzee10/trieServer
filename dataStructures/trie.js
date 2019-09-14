const fs = require("fs");

TrieNode = require('./trieNode');

class Trie{
    constructor(){
        this.root = new TrieNode('root');
    }

    get root(){
        return this._root;
    }

    set root(val){
        this._root = val;
    }

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