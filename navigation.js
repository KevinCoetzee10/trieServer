/**
 * Filename: navigation.js
 * Author: Kevin Coetzee
 * 
 *  The navigation.js file is used for routing within the Trie website interface
 */

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
        loadTrie(response, returnMenu);
    });

    /**
     * trieAdd route for server, calls different return functions with relevant
     * word and response values, as well as the global trie variable, depending
     * on whether a valid word to add is received.
     */
    router.get('/trieAdd', (request, response, next) =>{
        if(request.query.addValue==""){
            returnEmptyFields(response);
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
            returnEmptyFields(response);
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
            loadTrie(response, returnEmptyTrie);
        });
    });


    /**
     * loadTrie - creates a new Trie data structure, and restores the state saved in the
     * save.txt textfile, to this new Trie. The trie is then saved as a global variable.
     * The relevant callback function is then called with the relevant response.
     * @param {object} response - the response which is sent through to the callback function for eventual responding
     * @param {function} callback - specific function to call after this function's execution based on initial route
     */
    function loadTrie(response, callback){
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
                trie.addWordIteratively(tempWord, false);
            }
            globalTrie = trie;
            callback(response);
        });
    }

    /**
     * returnMenu - responds to the initial request with just the basic trie menu.
     * @param {object} response - specific response to be used for serving HTML
     */
    function returnMenu(response){
        response.send(menuTop+menuBottom);
    };

    /**
     * returnSearchResult - calls the Trie's search function to determine whether an entered
     * word exists within trie, and returns an HTML message indicating whether it could be 
     * found or not.
     * @param {string} requestValue - the word to be searched for
     * @param {object} response - specific response to be used for serving HTML
     * @param {Trie} trie - trie which must be searched
     */
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

    /**
     * returnAddResult - calls the Trie's add function to determine whether an entered
     * word  already exists within the trie, and adds the word if it was not already added.
     * The save flag in the add function is used to save the new word to the save.txt textfile.
     * The function then returns an HTML message indicating whether it could be added or not.
     * @param {string} requestValue - the word to be added to the trie
     * @param {object} response - specific response to be used for serving HTML
     * @param {Trie} trie - trie which must be added to
     */
    function returnAddResult(requestValue, response, trie){
        let responseString = menuTop;
        if(trie.addWordIteratively(requestValue,true)){
            responseString += "<p>The word has been added successfully!</p>"
        }else{
            responseString += "<p>The word could not be added, as it already exists in the trie.</p>"
        }
        responseString += menuBottom;
        response.send(responseString);
    }

    /**
     * returnEmptyTrie - responds to the initial request with just the basic trie menu and a 
     * message indicating that the trie has been cleared.
     * @param {object} response - specific response to be used for serving HTML
     */
    function returnEmptyTrie(response){
        response.send(menuTop + '<p>The trie has been cleared.</p>' + menuBottom);
    }

    /**
     * returnEmptyFields - responds to the initial request with just the basic trie menu and a 
     * message indicating that all fields were empty.
     * @param {object} response - specific response to be used for serving HTML
     */
    function returnEmptyFields(response){
        response.send(menuTop + '<p>Please enter a value into the relevant field.</p>' + menuBottom);
    }

module.exports = router;