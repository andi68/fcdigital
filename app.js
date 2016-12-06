var express = require('express'),
   bodyParser = require('body-parser'),
  moment = require('moment'),
 app = express();

app.use(bodyParser.json());

app.post('/testroman', function (request, res) {

    logCalc(1);
    logCalc(2);
    logCalc(3);
    logCalc(4);
    logCalc(5);
    logCalc(6);
    logCalc(7);
    logCalc(8);
    logCalc(9);
    logCalc(10);
    logCalc(11);


    logCalc(40);
    logCalc(80);

});

function logCalc(num) {
    var roman = decimalToRomanSimple(num);

    var digit = fromRoman(roman)

    console.log(num + "->" + roman + "->" + digit);
}

function fromRoman(str) {
  var result = 0;
  // the result is now a number, not a string

//  var decimal = [1000, 900, 500, 400, 100, 90, 39, 30.6, 8.4, 7.4, 4.4, 3.4, 1];
//  var roman = ["M", "CM","D","CD","C", "XC", "L", "XL", "X","IX","V","IV","I"];

  var decimal = [39, 30.6, 8.4, 7.4, 4.4, 3.4, 1];
  var roman = ["L", "XL", "X","IX","V","IV","I"];

  for (var i = 0;i<=decimal.length;i++) {
    while (str.indexOf(roman[i]) === 0){
    //checking for the first characters in the string
      result += decimal[i];
      //adding the decimal value to our result counter
      str = str.replace(roman[i],'');
      //remove the matched Roman letter from the beginning
    }
  }
  return result;
}

function decimalToRomanSimple(value) {
    var roman = new Array();
    roman = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
    var decimal = new Array();
    decimal = [1000,900,500,400,100,90,50,40,10,9,5,4,1];

      if (value <= 0 || value >= 4000) return value;

        var romanNumeral = "";
        for (var i=0; i<roman.length; i++) {
          while (value >= decimal[i]) {
            value -= decimal[i];
            romanNumeral += roman[i];
          }
        }
        return romanNumeral;
    }

app.post('/quote', function (request, res) {

  try {
 
    console.log(request.body)
 
    var country = request.body.country,
        departureDate = request.body.departureDate,
        returnDate = request.body.returnDate,
        travellerAges = request.body.travellerAges,
        options = request.body.options,
        cover = request.body.cover;

    console.log("---> start data from request")
    console.log(country)
    console.log(departureDate)
    console.log(returnDate)
    console.log(travellerAges)
    console.log(options)
    console.log(cover)
    console.log("---> end data from request")

    var quote =  calculateQuote(departureDate, returnDate, travellerAges, country, cover, options)
    console.log("---> calculated quote: ")  
    console.log(quote)

    //res.status(204).send();
    res.json({"quote": quote});
  } catch (err) {
    res.status(400).send();
  }

});


app.post('/feedback', function (req, res) {
   console.log(req.body.message);
   console.log(req.body.type);
   res.status(200).send();
});

app.listen(3000, function () {
 console.log('Example app listening on port 3000!');
});


function calculateQuote(_departureDate, _returnDate, _travellerAges, _country, _cover, _options) {
  var country = getCountry(_country),
      cover = getCover(_cover), 
      ageRiskSum = calcualteAgeRisk(_travellerAges),
      numberOfDays = calculateNumberOfDays(_departureDate, _returnDate),
      options = calcualteOptions(_options);

  var roman = getRoman(numberOfDays);

  var quote =  (cover * country * ageRiskSum *  roman) +  options;

  return quote

}

function getCover(_cover) {
  var coverList= {
    "Basic": 1.8,
    "Extra": 2.4,
    "Premier": 4.2 };

  var ret = coverList[_cover]

  console.log("--> cover: ")
  console.log(ret)

  return ret
}



function calculateNumberOfDays(departureDate, returnDate) {
  var departureDateAsDate = moment(departureDate, 'YYYY-MM-DD'); 
  var returnDateAsDate = moment(returnDate, 'YYYY-MM-DD'); 

  var duration = moment.duration(returnDateAsDate.diff(departureDateAsDate));
  var numberOfDays = duration.asDays();

  var numberOfDaysAsInt = parseInt(numberOfDays)

  console.log("--> number of day: ")
  console.log(numberOfDaysAsInt )

  return numberOfDaysAsInt;
}


function getCountry(country) {
  var countryList = {
    "ES": 1.3,
    "LU": 1.3,
    "EL": 0.6,
    "DO": 1.3,
    "IT": 1.2,
    "BU": 1.1,
    "IM": 1.2,
    "HM": 0.7,
    "SE": 1.2,
    "UK": 1.1,
    "PA": 1.6,
    "PN": 1.2,
    "QA": 1.6,
    "RO": 1.3,
    "TH": 1.6,
    "KP": 6.9,
    "LT": 0.7,
    "UY": 1.6,
    "FI": 0.8,
    "HR": 1.3,
    "LV": 0.6,
    "IE": 1.1,
    "MK": 1.6,
    "FR": 1.0,
    "MT": 1.2,
    "PT": 0.5,
    "SZ": 3.7,
    "NL": 0.7,
    "EG": 0.9,
    "MX": 1.6,
    "CY": 1.6,
    "BE": 0.9,
    "ES": 1.1,
    "TD": 1.3,
    "WF": 1.5,
    "DE": 0.8,
    "SK": 0.7,
    "AT": 0.9,
    "ZA": 1.6,
    "CZ": 1.2,
    "DK": 1.2,
    "SI": 0.8,
    "PL": 1.4,
    "HU": 1.1,
    "TW": 1.6
  };

  var ret = countryList[country]

  console.log("--> country: ")
  console.log(ret)

  return ret
}



function calcualteAgeRisk(ages) {
    var result = 0;
    for (i = 0; i < ages.length; i++) { 
        if (ages[i] > 0 && ages[i] < 18) {
            result = result + 1.1;
        } else if (ages[i] >= 18 && ages[i] <= 24) {
            result = result + 0.9;
        } else if (ages[i] >= 25 && ages[i] <= 65) {
            result = result + 1.0;
        } else if (ages[i] >= 66 ) {
            result = result + 1.5;
        }
    }

    console.log("--> ageRisk: ")
    console.log(result)

    return result;
}

function calcualteOptions(options) {
    var optionList = {
    "Skiing": 24,
    "Medical": 72,
    "Scuba": 36,
    "Sports": 25,
    "Yoga": -3 };

    var optionSum = 0;

    for (i = 0; i < options.length; i++) { 
      optionSum += optionList[options[i]]
    }

    console.log("--> optionSum: ")
    console.log(optionSum)

    return optionSum;
}

function getRoman(_numberOfDays) {

  if (_numberOfDays > 50) {
    console.log("--> roman: fix to 16.8")
    return 16.8
  }    

  var digit = [
    0,
    1, //1
    2,
    3,
    3.4,
    4.4,
    5.4,
    6.4,
    7.4,
    7.4,
    8.4, //10
    9.4,
    10.4,
    11.4,
    11.8,
    12.8,
    13.8,
    14.8,
    15.8,
    15.8,
    16.8, //20
    17.8,
    18.8,
    19.8,
    20.2,
    21.2,
    22.2,
    23.2,
    24.2,
    24.2,
    25.2, //30
    26.2,
    27.2,
    28.2,
    30.6,
    29.6,
    30.6,
    31.6,
    32.6,
    34.6,
    33.6,  //40
    34.6,
    35.6,
    36.6,
    39.0,
    38.0,
    39.0,
    40.0,
    41.0,
    43.0,
    39.0 //50
]

  var ret = digit[_numberOfDays]

  console.log("--> roman: ")
  console.log(ret)

  return ret

}

