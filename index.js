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
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//ste strength grey color
setIndicator("#ccc");

//set password lenght
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
 // or kuch bhi karna chahiye ? - HW
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  //shadow
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;

}

function getRandInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRandInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRandInteger(97, 123));
}
function generateUpperCase() {
  return String.fromCharCode(getRandInteger(65, 91));
}
function generateSymbols() {
  const randNum = getRandInteger(0, symbols.length);
  return symbols.charAt(randNum);
}
function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerHTML = "copied";
  }
  catch (e) {
    copyMsg.innerHTML = "Failed";
  }
  //to make copy val span visible
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);


}

function shufflePassword(array){

  //fisher yates method
  for (let i = array.length - 1; i > 0; i--) {
    //random J, find out using random function
    const j = Math.floor(Math.random() * (i + 1));
    //swap number at i index and j index
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
let str = "";
array.forEach((el) => (str += el));
return str;

}
function handleCheckBoxChange() {

  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked)
      checkCount++;
  });

  //special condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}
allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
  passwordLength = e.target.value;
  handleSlider();
})

copyBtn.addEventListener('click', () => {
  if (passwordDisplay.value)
    copyContent();
})

generateBtn.addEventListener('click', () => {
  if (checkCount == 0)
    return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  //lets start the journey to find new password

  //remove old pssword
  password = "";

  //lets put the stuff mention by checkbox
  // if(uppercaseCheck.checked){
  //   password+=generateUpperCase();
  // }
  // if(lowercaseCheck.checked){
  //   password+=generateLowerCase();
  // }
  // if(numbersCheck.checked){
  //   password+=generateRandomNumber();
  // }
  // if(symbolsCheck.checked){
  //   password+=generateSymbols();
  // }

  let funArr = [];

  if (uppercaseCheck.checked) {
    funArr.push(generateUpperCase);
  }
  if (numbersCheck.checked) {
    funArr.push(generateRandomNumber);
  }
  if (lowercaseCheck.checked) {
    funArr.push(generateLowerCase);
  }
  if (symbolsCheck.checked) {
    funArr.push(generateSymbols);
  }


  //compulsory addition

  for(let i=0;i<funArr.length;i++){
    password+=funArr[i]();
  }
  //remaining addition

  for(let i=0;i<passwordLength-funArr.length;i++){
     let randIndex=getRandInteger(0,funArr.length);
     password+=funArr[randIndex]();
  }


  //shuffle to password

  password=shufflePassword(Array.from(password));

  //show i UI
  passwordDisplay.value=password;
  //calculate strength
  calcStrength();

})