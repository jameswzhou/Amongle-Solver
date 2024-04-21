const fs = require('fs');
const readline = require('readline');

function readWordsFromFile(filename, callback) {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            callback(err, null);
            return;
        }

        let words = data.split('\r\n');
        callback(null, words);
    });
}

const position1 = [
    [1, 2, 3],
    [0, 1, 2, 3],
    [1, 3]
]

const position2 = [
    [0, 1, 2],
    [0, 1, 2, 3],
    [0, 2]
]

const position3 = [
    [2, 3, 4],
    [1, 2, 3, 4],
    [2, 4]
]

const position4 = [
    [1, 2, 3],
    [1, 2, 3, 4],
    [1, 3]
]

const positions = [
    position1,
    position2,
    position3,
    position4
]

function condition1(word1, word2, positions, remainingPositions) {
    return word1.charAt(positions[0]) === word2.charAt(positions[0]) &&
        word1.charAt(positions[1]) === word2.charAt(positions[1]) &&
        word1.charAt(positions[2]) === word2.charAt(positions[2]) &&
        greyTiles(word1, word2, positions, remainingPositions)
        ;
}

function condition2(word1, word2, containingPositions, equalPositions, remainingPositions) {
    const includeConditionMet = condition2Includes(word1, word2, containingPositions[0], containingPositions[1], remainingPositions[0]);
    const lastCharacterCondition = word1.charAt(remainingPositions[0]) !== word2.charAt(remainingPositions[0]) &&
        (!word1.includes(word2.charAt(remainingPositions[0])) || word2.substr(positions[0], 4).includes(word2.charAt(remainingPositions[0])));
    return includeConditionMet && word1.charAt(equalPositions[0]) === word2.charAt(equalPositions[0]) && word1.charAt(equalPositions[1]) === word2.charAt(equalPositions[1]) && lastCharacterCondition;
}

// pos1 and pos2 are spaces that should contain characters that are in the word
// pos3 is the remaining space that should be compared to
function condition2Includes(word1, word2, pos1, pos2, pos3) {
    const includeCondition = (word1.charAt(pos1) !== word2.charAt(pos1) && word2.charAt(pos1) === word1.charAt(pos2) &&
        (word1.charAt(pos2) !== word2.charAt(pos2) && (word2.charAt(pos2) === word1.charAt(pos1)))) ||
        (word1.charAt(pos1) !== word2.charAt(pos1) && word2.charAt(pos1) === word1.charAt(pos2) &&
            (word1.charAt(pos2) !== word2.charAt(pos2) && (word2.charAt(pos2) === word1.charAt(pos3)))) ||
        (word1.charAt(pos1) !== word2.charAt(pos1) && word2.charAt(pos1) === word1.charAt(pos3) &&
            (word1.charAt(pos2) !== word2.charAt(pos2) && (word2.charAt(pos2) === word1.charAt(pos1))));
    return includeCondition;
}

function condition3(word1, word2, positions, remainingPositions) {
    return word1.charAt(positions[0]) === word2.charAt(positions[0]) &&
        word1.charAt(positions[1]) === word2.charAt(positions[1]) &&
        word1.charAt(positions[2]) === word2.charAt(positions[2]) &&
        word1.charAt(positions[3]) === word2.charAt(positions[3]) &&
        greyTiles(word1, word2, positions, remainingPositions);
}

function condition4(word1, word2, positions, remainingPositions) {
    return word1.charAt(positions[0]) === word2.charAt(positions[0]) &&
        word1.charAt(positions[1]) === word2.charAt(positions[1]) &&
        greyTiles(word1, word2, positions, remainingPositions);
}

function greyTiles(word1, word2, positions, remainingPositions) {
    const word1Arr = [...word1];
    const word2Arr = [...word2];

    const res = remainingPositions.map(position => {
        return word1Arr[position] !== word2Arr[position] &&
            (!word1Arr.includes(word2Arr[position]) ||
                (word1Arr.filter((_, index) => positions.includes(index)).includes(word2Arr[position]) && // letter has already been used
                    !word1Arr.filter((_, index) => remainingPositions.includes(index)).includes(word2Arr[position])) // letter does not appear elsewhere in the word
            );
    });

    if (res.includes(false)) {
        return false;
    }
    return true;
}

function findWords(searchWords, words, positions, index) {
    const condition1RemainingPositions = [0, 1, 2, 3, 4].filter(position => !positions[0].includes(position));
    let condition2Positions = positions[1];
    let containingPositions;
    if (index % 2 === 0) {
        containingPositions = [condition2Positions[2], condition2Positions[3]];
    } else {
        containingPositions = [condition2Positions[0], condition2Positions[1]];
    }
    const equalPositions = condition2Positions.filter(position => !containingPositions.includes(position));
    const remainingPositions = [0, 1, 2, 3, 4].filter(position => !condition2Positions.includes(position));
    const condition3RemainingPositions = [0, 1, 2, 3, 4].filter(position => !positions[1].includes(position));
    const condition4RemainingPositions = [0, 1, 2, 3, 4].filter(position => !positions[2].includes(position));

    searchWords.forEach(word => {
        let condition1Words = [];
        words.forEach(word2 => {
            if (condition1(word, word2, positions[0], condition1RemainingPositions)) {
                condition1Words.push(word2);
            }
        });
        if (condition1Words.length === 0) {
            return;
        }
        let condition2Words = [];

        words.forEach(word2 => {
            if (condition2(word, word2, containingPositions, equalPositions, remainingPositions)) {
                condition2Words.push(word2);
            }
        });
        if (condition2Words.length === 0) {
            return;
        }
        let condition3Words = [];
        words.forEach(word2 => {
            if (condition3(word, word2, positions[1], condition3RemainingPositions)) {
                condition3Words.push(word2);
            }
        });
        if (condition3Words.length === 0) {
            return;
        }
        let condition4Words = [];
        words.forEach(word2 => {
            if (condition4(word, word2, positions[2], condition4RemainingPositions)) {
                condition4Words.push(word2);
            }
        });
        if (condition4Words.length === 0) {
            return;
        }
        const result = `Word: ${word} Condition 1: ${condition1Words} Condition 2: ${condition2Words} Condition 3: ${condition3Words} Condition 4: ${condition4Words}\n`
        // fs.appendFile(`results${index}.txt`, result, err => {
        //     if(err){
        //         console.error(err);
        //     }
        // })
        console.log(`Formation ${index + 1}`)
        console.log(result);
    })
}

// readWordsFromFile('words.txt', (err, words) => {
//     if (err) {
//         console.error('Error reading file:', err);
//         return;
//     }

//     console.log('Words:', words);

//     positions.forEach((position, index) => {
//         findWords(words, words, position, index)
//         console.log("Finished one iteration");
//     });

// });

readWordsFromFile('words.txt', (err, words) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter the word: ', (word) => {
        positions.forEach((position, index) => {
            findWords([word], words, position, index)
        });
        rl.close();
    });

});
