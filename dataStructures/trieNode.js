/**
 * TrieNode - class representing a single node used within the Trie data structure
 */
class TrieNode{
    /**
     * constructor - constructor for the TrieNode class, that initalises the node's stored value,
     * as well as whether it respresents a complete word and its empty array of children.
     * @param {string} letter - letter representing the node's value
     */
    constructor(letter){
        this.value = letter;
        this.completeWord = false;
        this.children = [];
    }

    /**
     * getter for the value parameter
     */
    get value(){
        return this._value;
    }

    /**
     * getter for the completeWord parameter
     */
    get completeWord(){
        return this._completeWord;
    }

    /**
     * setter for the value parameter
     */
    set value(val){
        this._value = val;
    }

    /**
     * setter for the completeWord parameter
     */
    set completeWord(val){
        this._completeWord = val;
    }

    /**
     * addChild - function used to add a new child node with a specific value to this node
     * @param {string} letter - letter representing the child node's value
     */
    addChild(letter){
        this.children.push(new TrieNode(letter));
    };

    /**
     * getChild - function that returns a specific child node if one is found with the entered 
     * letter as a value
     * @param {string} letter - letter representing the child node's value
     */
    getChild(letter){
        let found = false;
        let index = 0;
        while((found==false)&&(index<this.children.length)){
            if(this.children[index].value == letter){
                found = true;
            }
            index++;
        }
        if(found==false){
            return null;
        }
        return this.children[index-1];
    }
}

module.exports = TrieNode;