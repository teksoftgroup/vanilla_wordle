document.addEventListener('DOMContentLoaded', () => {

    createTiles();
    getNewWord();

    let guessedWords = [[]];
    let availableSpace = 1;

    let word = 'dairy';
    let guessWordCount = 0;

    const keys = document.querySelectorAll('.keyboard-row button');

    function getNewWord(){
        fetch('./data/wordbank_a.json')
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(err => console.log('error', err));
    }

    function getCurrentWordArray(){
        const numberOfguesses = guessedWords.length;
        return guessedWords[numberOfguesses - 1];
    }

    function updateGuessedWords(letter){
        const currentWord = getCurrentWordArray();

        if(currentWord && currentWord.length < 5){
            currentWord.push(letter);
            const availableSpaceEL = document.getElementById(String(availableSpace));
            availableSpace = availableSpace + 1
            availableSpaceEL.textContent = letter;
        }
    }

    function getTileColor(letter, index){
        const isCorrectLetter = word.includes(letter);

        if(!isCorrectLetter){
            return "rgb(58, 58, 60)";
        }
        const letterAtProvidedIndex = word.charAt(index);
        const isCorrectIndex = letter === letterAtProvidedIndex;

        if(isCorrectIndex){
            return "rgb(83, 141, 78)";
        }

        return "rgb(181, 159, 59)";
    }

    function submitWord(){
        const currentWordArray = getCurrentWordArray();
        if(currentWordArray.length !== 5){
            window.alert('Word must be 5 letters');
            return;
        }

        const currentWord = currentWordArray.join('');
        const firstLetterId = guessWordCount * 5 + 1;
        const interval = 200;

        currentWordArray.forEach((letter, index) => {
            setTimeout(() => {
                const tileColor = getTileColor(letter, index);

                const letterId = firstLetterId + index;
                const letterEL = document.getElementById(letterId);
                letterEL.classList.add('animate__flipInX');
                letterEL.style = `background-color: ${tileColor};border-color:${tileColor}`;
            }, interval * index);
        });

        guessWordCount += 1;

        if(currentWord === word){
            window.alert('Congratulations!');
            return;
        }

        if(guessedWords.length === 6){
            window.alert(`The word you had to guess was "${word}"`);
        }

        guessedWords.push([]);
    }

    function createTiles(){
        const gameBoard = document.getElementById('board');
        for (let i = 0; i < 30; i++){
            let tile = document.createElement("div");
            tile.classList.add("tile");
            tile.classList.add("animate__animated")
            tile.setAttribute("id", i + 1);
            gameBoard.appendChild(tile);
        }
    }

    for(let i = 0; i < keys.length; i++){
        keys[i].onclick = ({target}) => {
            const letter = target.getAttribute('data-key');
            if(letter === 'enter'){
                submitWord();
                return;
            }
            updateGuessedWords(letter);
        }; 
    }

})