class TrieNode{
    constructor(letter){
        this.value = letter;
        this.completeWord = false;
        this.children = [];
    }

    get value(){
        return this._value;
    }

    get completeWord(){
        return this._completeWord;
    }

    set value(val){
        this._value = val;
    }

    set completeWord(val){
        this._completeWord = val;
    }

    addChild(letter){
        this.children.push(new TrieNode(letter));
    };

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