const { spawn } = require("child_process");
//const spawner = require('child_process').spawn;

/*
const data_to_pass = ['send this to python'];

const python = spawner('python', ["test2.py", JSON.stringify(data_to_pass)]);

python.stdout.on('data', (data) => {
    console.log('Data from python script: ', JSON.parse(data.toString()));
});
*/


const python = spawn('python', ["model.py"]);
const buffers = [];

python.stdout.on('data', (chunk) => buffers.push(chunk));
python.stdout.on('end', () => {
    const result = JSON.parse(Buffer.concat(buffers));
    console.log('Python process exited, result:', result);
});

let num_tas = 5

let num_days = 6
let num_slots = 5
let num_courses = 3
let num_tutorialGroups = 5

// 5
let taCourseAssignment = [
    [9, 6, 0],
    [3, 6, 0],
    [3, 0, 12],
    [9, 0, 0],
    [6, 0, 6]
]

// 6
let taDayOffPreference = [
    [6, 5, 3, 4, 2, 1],
    [1, 2, 6, 5, 4, 3],
    [1, 2, 3, 4, 5, 6],
    [1, 2, 3, 6, 4, 5],
    [6, 1, 5, 4, 3, 2],
]

// 7
let sessionNumberPreference = [
    [2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2],
    [0, 2, 2, 2, 2, 2],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
]

// 8
let schedule = [
    // sat
    [[[1, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
    [[1, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
    [[0, 1, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
    [[1, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
    [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
    ],
    // sun
    [[[0, 0, 0, 0, 0], [0, 0, 0, 1, 0], [0, 0, 0, 0, 1]],
    [[0, 0, 0, 1, 1], [0, 0, 1, 0, 0], [0, 1, 0, 0, 0]],
    [[0, 1, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
    [[0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 1]],
    [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
    ],
    // mon
    [[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
    [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
    [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
    [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
    [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
    ],
    // tue
    [[[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
    [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
    [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
    [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
    [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
    ],
    // wed
    [[[0, 0, 0, 0, 0], [0, 0, 0, 1, 0], [0, 0, 0, 0, 1]],
    [[0, 0, 0, 1, 1], [0, 0, 1, 0, 0], [0, 1, 0, 0, 0]],
    [[0, 1, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
    [[0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 1]],
    [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
    ],
    // thu
    [[[0, 0, 0, 0, 0], [0, 0, 0, 1, 0], [0, 0, 0, 0, 1]],
    [[0, 0, 0, 1, 1], [0, 0, 1, 0, 0], [0, 1, 0, 0, 0]],
    [[0, 1, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
    [[0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 1]],
    [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
    ],
]


python.stdin.write(JSON.stringify([num_tas, num_days, num_slots, num_courses, num_tutorialGroups, taCourseAssignment, taDayOffPreference, sessionNumberPreference, schedule]));
python.stdin.end()



