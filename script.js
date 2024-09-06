const arrayContainer = document.querySelector(".array-container");
let array = [];
let speed = 100; // Default speed
let arraySize = 20; // Default array size
let isSorting = false; // Flag to track if sorting is in progress

// Function to generate a new array
function generateArray(size = arraySize) {
    if (isSorting) return; // Prevent array generation during sorting
    array = [];
    arrayContainer.innerHTML = "";
    for (let i = 0; i < size; i++) {
        const value = Math.floor(Math.random() * 100) + 1;
        array.push(value);
        const arrayBar = document.createElement("div");
        arrayBar.classList.add("array-bar");
        arrayBar.style.height = `${value * 3}px`;
        arrayBar.style.width = `${100 / size}%`;
        arrayContainer.appendChild(arrayBar);
    }
}

// Function to disable UI elements during sorting (except speed slider)
function disableUI() {
    document.getElementById("sizeSlider").disabled = true;
    document.getElementById("generateArrayBtn").disabled = true;
    document.querySelectorAll(".btn-group .btn").forEach(button => button.disabled = true);
    isSorting = true;
}

// Function to enable UI elements after sorting
function enableUI() {
    document.getElementById("sizeSlider").disabled = false;
    document.getElementById("generateArrayBtn").disabled = false;
    document.querySelectorAll(".btn-group .btn").forEach(button => button.disabled = false);
    isSorting = false;
}

// Bubble Sort
async function bubbleSort() {
    disableUI();
    const bars = document.querySelectorAll(".array-bar");
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            bars[j].style.backgroundColor = "red";
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                bars[j].style.height = `${array[j] * 3}px`;
                bars[j + 1].style.height = `${array[j + 1] * 3}px`;
                await sleep(speed);
            }
            bars[j].style.backgroundColor = "#007bff";
        }
        bars[array.length - i - 1].style.backgroundColor = "green";
    }
    bars[0].style.backgroundColor = "green"; // Ensure the last bar is colored
    enableUI();
}

// Selection Sort
async function selectionSort() {
    disableUI();
    const bars = document.querySelectorAll(".array-bar");
    for (let i = 0; i < array.length; i++) {
        let minIndex = i;
        bars[minIndex].style.backgroundColor = "red";
        for (let j = i + 1; j < array.length; j++) {
            bars[j].style.backgroundColor = "yellow";
            await sleep(speed);
            if (array[j] < array[minIndex]) {
                bars[minIndex].style.backgroundColor = "#007bff"; // Reset color of old minIndex
                minIndex = j;
                bars[minIndex].style.backgroundColor = "red";
            } else {
                bars[j].style.backgroundColor = "#007bff"; // Reset color if not minimum
            }
        }
        if (minIndex !== i) {
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            bars[i].style.height = `${array[i] * 3}px`;
            bars[minIndex].style.height = `${array[minIndex] * 3}px`;
        }
        bars[i].style.backgroundColor = "green"; // Mark the sorted section
    }
    enableUI();
}

// Merge Sort
async function mergeSort(start = 0, end = array.length - 1) {
    if (start < end) {
        const mid = Math.floor((start + end) / 2);
        await mergeSort(start, mid);
        await mergeSort(mid + 1, end);
        await merge(start, mid, end);
    }
}

async function merge(start, mid, end) {
    const bars = document.querySelectorAll(".array-bar");
    let left = array.slice(start, mid + 1);
    let right = array.slice(mid + 1, end + 1);
    let k = start;
    while (left.length && right.length) {
        bars[k].style.backgroundColor = "red";
        if (left[0] <= right[0]) {
            array[k] = left.shift();
        } else {
            array[k] = right.shift();
        }
        bars[k].style.height = `${array[k] * 3}px`;
        await sleep(speed);
        bars[k].style.backgroundColor = "green";
        k++;
    }
    while (left.length) {
        array[k] = left.shift();
        bars[k].style.height = `${array[k] * 3}px`;
        await sleep(speed);
        bars[k].style.backgroundColor = "green";
        k++;
    }
    while (right.length) {
        array[k] = right.shift();
        bars[k].style.height = `${array[k] * 3}px`;
        await sleep(speed);
        bars[k].style.backgroundColor = "green";
        k++;
    }
}

// Insertion Sort
async function insertionSort() {
    disableUI();
    const bars = document.querySelectorAll(".array-bar");
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        bars[i].style.backgroundColor = "red";
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            bars[j + 1].style.height = `${array[j + 1] * 3}px`;
            bars[j + 1].style.backgroundColor = "red";
            await sleep(speed);
            j--;
        }
        array[j + 1] = key;
        bars[j + 1].style.height = `${array[j + 1] * 3}px`;
        bars[i].style.backgroundColor = "green";
    }
    enableUI();
}

// Bogo Sort (Highly inefficient, purely for demonstration)
async function bogoSort() {
    disableUI();
    const bars = document.querySelectorAll(".array-bar");
    while (!isSorted()) {
        shuffle(array);
        for (let i = 0; i < array.length; i++) {
            bars[i].style.height = `${array[i] * 3}px`;
            bars[i].style.backgroundColor = "yellow";
        }
        await sleep(speed);
    }
    for (let i = 0; i < array.length; i++) {
        bars[i].style.backgroundColor = "green";
    }
    enableUI();
}

function isSorted() {
    for (let i = 1; i < array.length; i++) {
        if (array[i] < array[i - 1]) return false;
    }
    return true;
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

// Function to simulate delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Event listeners
document.getElementById("generateArrayBtn").addEventListener("click", () => generateArray());
document.getElementById("bubbleSortBtn").addEventListener("click", () => bubbleSort());
document.getElementById("selectionSortBtn").addEventListener("click", () => selectionSort());
document.getElementById("insertionSortBtn").addEventListener("click", () => insertionSort());
document.getElementById("mergeSortBtn").addEventListener("click", async () => {
    disableUI();
    await mergeSort();
    enableUI();
});
document.getElementById("bogoSortBtn").addEventListener("click", () => bogoSort());

document.getElementById("speedSlider").addEventListener("input", (e) => {
    speed = e.target.value;
});

document.getElementById("sizeSlider").addEventListener("input", (e) => {
    arraySize = e.target.value;
    generateArray(arraySize);
});

window.onload = () => generateArray();
