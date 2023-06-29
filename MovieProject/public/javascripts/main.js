
let orderArray = [];
// define a constructor to create order objects
let OrderObject = function (pStoreID, pSalesPersonID, pCdID, pPricePaid, pDate) {
    this.StoreID = pStoreID
    this.SalesPersonID = pSalesPersonID;
    this.CdID = pCdID;
    this.PricePaid = pPricePaid;
    this.Date = pDate;
}

let selectedGenre = "not selected";

document.addEventListener("DOMContentLoaded", function () {

    createList();

});  
// end of wait until document has loaded event  *************************************************************************

function buttonCreate(bool) {
    let newOrder = generateOrder(bool);
    console.log(newOrder);
    fetch('/AddOrder', {
        method: "POST",
        body: JSON.stringify(newOrder),
        headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json()) 
        .then(json => console.log(json),
        createList()
        )
        .catch(err => console.log(err));
}

function button500() {
    for (let i = 0; i < 499; i++) {
        buttonCreate(true);
    }
}

function buttonThree() {
    let primeStoreID = [98053, 98059, 98066];
    let primeSalesPersonID = [5, 10, 15];
    let primeCdID = [ 2, 4, 123456];
    let primePricePaid = [1, 2, 3,];
    let primeDate = { 0:Date.now(), 1:Date.now()+5000, 2:Date.now()+10000 };

    for(let i=0; i < 3; i++){
        let newOrder = new OrderObject(primeStoreID[i], primeSalesPersonID[i], primeCdID[i], primePricePaid[i], primeDate[i]); 
        fetch('/AddOrder', {
            method: "POST",
            body: JSON.stringify(newOrder),
            headers: {"Content-type": "application/json; charset=UTF-8"}
            })
            .then(response => response.json()) 
            .then(json => console.log(json),
            createList()
            )
            .catch(err => console.log(err));
    }
    createList();   
}

function filterStore98053(){    
        fetch('/getStore98053')
        // Handle success
        .then(response => response.json())  // get the data out of the response object
        .then( responseData => fillUL(responseData))    //update our array and li's
        .catch(err => console.log('Request Failed', err)); // Catch errors
    }

function filterCD123456(){
        fetch('/getCD123456')
        // Handle success
        .then(response => response.json())  // get the data out of the response object
        .then( responseData => fillUL(responseData))    //update our array and li's
        .catch(err => console.log('Request Failed', err)); // Catch errors
    }

function generateOrder(make500) {
    const listStoreID = [98053, 98007, 98077, 98055, 98011, 98046 ];
    const listCD = [ 123456, 123654, 321456, 321654, 654123, 654321, 543216, 354126, 621453, 623451];


    generatedStoreID = listStoreID[getRandomInt(0, 6)];
    switch (generatedStoreID) {
        case 98053:
        generatedSalesPersonID = getRandomInt(1,5);
        break;

        case 98007:
        generatedSalesPersonID = getRandomInt(5,9);
        break;
        
        case 98077:
        generatedSalesPersonID = getRandomInt(9,13);
        break;

        case 98055:
        generatedSalesPersonID = getRandomInt(13,17);
        break;

        case 98011:
        generatedSalesPersonID = getRandomInt(17,21);
        break;

        case 98046:
        generatedSalesPersonID = getRandomInt(21,25);
        break;
    }
    generatedCdID = listCD[getRandomInt(0, 10)];
    generatedPricePaid = getRandomInt(5, 16);

    if (make500 == true) {
        generatedDate = Date.now() + getRandomInt(5000,30000);
    } else {
        generatedDate = Date.now();
    }
    
    let newOrder = new OrderObject(generatedStoreID, generatedSalesPersonID, generatedCdID, generatedPricePaid, generatedDate);
    //console.log(newOrder);
    return newOrder;
    }
    
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
    }

function createList() {
// update local array from server

    fetch('/getAllOrders')
    // Handle success
    .then(response => response.json())  // get the data out of the response object
    .then( responseData => fillUL(responseData))    //update our array and li's, AJAX
    .catch(err => console.log('Request Failed', err)); // Catch errors
};

function fillUL(data) {
        // clear prior data
    var divOrderList = document.getElementById("divOrderList");
    while (divOrderList.firstChild) {    // remove any old data so don't get duplicates
        divOrderList.removeChild(divOrderList.firstChild);
    };

    var ul = document.createElement('ul');
    orderArray = data;
    orderArray.forEach(function (element,) {   // use handy array forEach method
        var li = document.createElement('li');
        // console.log(element);
        li.innerHTML =
        //Marcus: sometimes gets confusingly labeled as "StoreID.[specificDetail]." Not sure why but heads up
        element.StoreID + ":  &nbsp &nbsp  &nbsp &nbsp " + 
        element.SalesPersonID + "  &nbsp &nbsp  &nbsp &nbsp "  + 
        element.CdID + " &nbsp &nbsp  &nbsp &nbsp  " + 
        element.PricePaid + " &nbsp &nbsp  &nbsp &nbsp  " + 
        element.Date;
        ul.appendChild(li);
    });
    divOrderList.appendChild(ul)
}

function deleteOrder(ID) {

    fetch('/DeleteOrder/' + ID, {
        method: "DELETE",
       // body: JSON.stringify(_data),
        headers: {"Content-type": "application/json; charset=UTF-8"}
      })
      .then(response => response.json()) 
      .then(json => console.log(json))
      .catch(err => console.log(err));



    // $.ajax({
    //     type: "DELETE",
    //     url: "/DeleteOrder/" +ID,
    //     success: function(result){
    //         alert(result);
    //         createList();
    //     },
    //     error: function (xhr, textStatus, errorThrown) {  
    //         alert("Server could not delete Order with ID " + ID)
    //     }  
    // });
   
}