const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const symbols = '~!@#$%^&*()_-+={[]}|:;"<,>.?/';  

let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();

setIndicator("#ccc");
// Function set the length of the password
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  // these below code represent that the right part of thumb with different color
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =((passwordLength - min) * 100) / (max - min) + "% 100%";
}

// Function to set the color of indicator
function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// Function to get random integers
function getRandomIntegers(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// These function will bring the randome digits from 0-9
function generateRandomNumber() {
  return getRandomIntegers(0, 9);
}

// function to generate lowercase
function generateLowercase() {
  // here passing ASCII value of lowercase abcd
  // String.fromCharCode will convert the number into the character
  return String.fromCharCode(getRandomIntegers(97, 123));
}

// function to generate uppercase
function generateUppercase() {
  // Here we're passing ASCII value of the uppercase ABCD
  return String.fromCharCode(getRandomIntegers(65, 91));
}

// Function to generate symbols
function generateSymbols() {
  const randNum = getRandomIntegers(0, symbols.length);
  return symbols.charAt(randNum);
}

// Function to calculate the length of password
function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && hasNum && hasSym && passwordLength >= 10) {
    setIndicator("#00ff00");
  } else if (
    (hasNum || hasSym) &&
    hasUpper &&
    hasLower &&
    passwordLength >= 8
  ) {
    setIndicator("yellow");
  } else {
    setIndicator("red");
  }
}

// Function for showing the copy msg
async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerHTML = "copied";
  } catch (e) {
    copyMsg.innerHTML = "failed";
  }
  // These line of code will add the active class
  copyMsg.classList.add("active");
  // These will remove the active class after 2000ms
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

const allCheckBoxes = document.querySelectorAll("input[type=checkbox]");

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBoxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }

    // Special case: if all are checked, then the generated password length will be the number of checked checkboxes
    if (passwordLength < checkCount) {
      passwordLength = checkCount;
      handleSlider();
    }
  });
}

allCheckBoxes.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});


// Function for shufflePassword
function shufflePassword(array) {
  // For shuffling the paswword we're using `Fisher Yates Method` but these algorithm work's on array. Hence we're receiving the array
  for (let i = array.length - 1; i > 0; i--) {
    // Here we're finding random `j` using random function
    const j = Math.floor(Math.random() * (i + 1));
    // Here we are swapping `i` & `j` index value
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  let str = "";
  array.forEach((el) => {
    str += el;
  });
  return str;
}

// These will generatePaswword
generateBtn.addEventListener("click", () => {
  if (checkCount <= 0) {
    // window.alert("Mark Checked any CheckBox");
    return;
  }

  // Special wala case
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
  // Generating remove the old password
  password = "";

  let funcArr = [];

  if (uppercaseCheck.checked) {
    funcArr.push(generateUppercase);
  }
  if (lowercaseCheck.checked) {
    funcArr.push(generateLowercase);
  }
  if (numbersCheck.checked) {
    funcArr.push(generateRandomNumber);
  }
  if (symbolsCheck.checked) {
    funcArr.push(generateSymbols);
  }

  // Let's handle compulsary case (In compulsary case you have to push the element which you have already selected...for.eg. you have checked the uppercase, lowercase, symbols, nums then these element are compulsary to have in the password)
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  // Now remanining addtion
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let ranIndex = getRandomIntegers(0, funcArr.length);
    password += funcArr[ranIndex]();
  }

  // Now you have to shuffle the password bcz, in these we can say that the first four letter will be the given only
  password = shufflePassword(Array.from(password));

  passwordDisplay.value = password;

  // Now at the end you have calculate the strength
  calcStrength();
});