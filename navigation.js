const express = require('express');
const router = express.Router();
const Trie = require('./dataStructures/trie');
const fs = require('fs');
let globalTrie;

/**
 * menuTop - top part of the Trie menu for re-use when serving HTML.
 * 
 * menuBottom - bottom part of the Trie menu for re-use when serving HTML.
 */
let menuTop = `
    <head>
        <title>Trie.</title>
    </head>
    <body>`;
let menuBottom = `
        <form action="http://localhost:3000/trieSearch" method="get">
            Search for a word:<br>
            <input type="text" name="searchValue" value=""><br>
            <input type="submit" value="Search.">
        </form>
        <form action="http://localhost:3000/trieAdd" method="get">
            Add a word:<br>
            <input type="text" name="addValue" value=""><br>
            <input type="submit" value="Add.">
        </form>
        <form action="http://localhost:3000/trieClear" method="get">
            Clear trie: <input type="submit" value="Clear.">
        </form>
        <form action="http://localhost:3000/" method="get">
            <input type="submit" value="Back.">
        </form>
    </body>`
    
    /**
     * default route for server, returns a menu listing all data structures that can
     * be used. Currently only a Trie, but can easily be expanded.
     */
    router.get('/', (request, response, next) =>{
        response.send(`
            <head>
                <title>Home.</title>
            </head>
            <body>
                <p>Currently, you can only build and search Tries:</p>
                <form action="http://localhost:3000/trieMenu" method="get">
                    <input type="submit" value="Trie me!">
                </form>
            </body>  
        `);
    });

    /**
     * trieMenu route for server, calls loadTrie function with the current
     * request, response and relevant callback function.
     */
    router.get('/trieMenu', (request, response, next) =>{
        loadTrie(request, response, returnMenu);
    });

    /**
     * trieAdd route for server, calls different return functions with relevant
     * word and response values, as well as the global trie variable, depending
     * on whether a valid word to add is received.
     */
    router.get('/trieAdd', (request, response, next) =>{
        if(request.query.addValue==""){
            returnEmptyFields(request.query.addValue, response, globalTrie);
        }else{
            returnAddResult(request.query.addValue, response, globalTrie);
        }
    });

    /**
     * trieSearch route for server, calls different return functions with relevant
     * word and response values, as well as the global trie variable, depending
     * on whether a valid word to search is received.
     */
    router.get('/trieSearch', (request, response, next) =>{
        if(request.query.searchValue==""){
            returnEmptyFields(request.query.addValue, response, globalTrie);
        }else{
            returnSearchResult(request.query.searchValue, response, globalTrie);
        }
    });

    /**
     * trieAdd route for server, empties the textfile where the tree's state is saved,
     * before calling the loadTrie function with the current request, response and 
     * relevant callback function.
     */
    router.get('/trieClear', (request, response, next)=>{
        fs.writeFile('save.txt', "", (error)=>{
            if(error){
                console.log(error);
            }
            loadTrie(request, response, returnEmptyTrie);
        });
    });


    /**
     * loadTrie - creates a new Trie data structure, and restores the state saved in the
     * save.txt textfile, to this new Trie.
     * @param {*} requestValue 
     * @param {*} response 
     * @param {*} callback 
     */
    function loadTrie(requestValue, response, callback){
        trie = new Trie();
        fs.readFile('save.txt', 'utf-8', (error, data)=>{
            let index = 0;
            let tempWord = "";
            while(index<data.length){
                if(data[index]=='\n'){
                    trie.addWordIteratively(tempWord, false);
                    tempWord = "";
                }else{
                    tempWord += data[index];
                }
                index++;
            }
            if(tempWord!=""){
                trie.addWordIteratively(tempWord);
            }
            callback(requestValue, response, trie);
        });
    }

    /**
     * trieMenu route for server, returns a menu listing all functions that can be 
     * performed on a Trie data structure (adding words, searching words, clearing Trie)
     */
    function returnMenu(requestValue, response, trie){
        globalTrie = trie;
        response.send(menuTop+menuBottom);
    };

    function returnSearchResult(requestValue, response, trie){
        let responseString = menuTop;
        if(trie.searchWordIteratively(requestValue)){
            responseString += "<p>The word has been found!</p>"
        }else{
            responseString += "<p>The word could not be found.</p>"
        }
        responseString += menuBottom;
        response.send(responseString);
    }

    function returnAddResult(requestValue, response, trie){
        let responseString = menuTop;
        if(trie.addWordAndSave(requestValue)){
            responseString += "<p>The word has been added successfully!</p>"
        }else{
            responseString += "<p>The word could not be added, as it already exists in the trie.</p>"
        }
        responseString += menuBottom;
        response.send(responseString);
    }

    function returnEmptyTrie(requestValue, response, trie){
        globalTrie = trie;
        response.send(menuTop + '<p>The trie has been cleared.</p>' + menuBottom);
    }

    function returnEmptyFields(requestValue, response, trie){
        response.send(menuTop + '<p>Please enter a value into the relevant field.</p>' + menuBottom);
    }

module.exports = router;