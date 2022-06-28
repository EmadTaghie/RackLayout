const addr = "2a22~23";
let result = false;
if(/\r|\n|\s/.test(addr) || !/,/.test(addr)){
    result = false;
} else {
    const rightHandedAddr = addr.split(",")[1];
    const numberSides = rightHandedAddr.split("~");
    if(numberSides.length === 2) {
        result = parseInt(numberSides[0]) < parseInt(numberSides[1]) && /[1-9]\d*\w,[1-9]\d*~[1-9]\d*/.test(addr);
    } else {
        result = /[1-9]\d*\w,[1-9]\d*/.test(addr);
    }
}
if (!result){
    console.log("Please enter the right string.");
}

console.log("result = ", result);