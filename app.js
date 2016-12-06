var express = require('express'),
   bodyParser = require('body-parser'),
  moment = require('moment'),
 app = express();

app.use(bodyParser.json());

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

  var countryCalc = getCountry(country)

    // check country
    if (country == null || countryCalc == null) {
         console.log("---> country is null")
         res.status(400).send();
         return;
    }

    // check ages
    for (i = 0; i < travellerAges.length; i++) {
        if (travellerAges[i] < 0) {
            res.status(400).send();
            return;
        }
    }

    var discountOf20Percent = false;

    // discount persons > 4
    if (travellerAges.length > 4) {
        var numberAdult = 0;
        var numberChilds = 0;
        var age = travellerAges[i];
        if (age > 25 && age < 65) {
            numberAdult++;
        } else {
            numberChilds++;
        }
        if (numberAdult > 2) {
            discountOf20Percent = true;
        }
    }

    // discount persons > 2
    var discountOf10Percent = false;
    if (travellerAges.length == 2) {
        var numberAdult = 0;
        var age = travellerAges[i];
        if (age >= 18 && age <= 24) {
            numberAdult++;
        }
        if (numberAdult == 2) {
            discountOf10Percent = true;
        }
    }

  var coverList= {
    "Basic": 1.8,
    "Extra": 2.4,
    "Premier": 4.2 };


  var daysBetween = daysBetween(departureDate, returnDate)
  console.log("---> daysBetween: ")  
  console.log(daysBetween)


  var quote =  (coverList[cover] * countryCalc * calcualteAgeRisk(travellerAges) * calculateNumberOfDays(departureDate, returnDate) ) + calcualteOptions(options) ;
  console.log("---> calculated quote: ")  
  console.log(quote)

  //res.status(204).send();
  res.json({"quote": quote});
    if (discountOf20Percent) {
        discountQuote = quote * 0,8;
        console.log("quote with discount: " + discountQuote);
        quote = discountQuote;
    } else if (discountOf10Percent) {
        discountQuote = quote * 0,9;
        console.log("quote with discount: " + discountQuote);
        quote = discountQuote;
    }

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


function calculateNumberOfDays(departureDate, returnDate) {
  var departureDateAsDate = moment(departureDate, 'YYYY-MM-DD'); 
  var returnDateAsDate = moment(returnDate, 'YYYY-MM-DD'); 

  var duration = moment.duration(returnDateAsDate.diff(departureDateAsDate));
  var numberOfDays = duration.asDays();

  var numberOfDaysAsInt = parseInt(numberOfDays)

  if (numberOfDaysAsInt > 7 && numberOfDaysAsInt <= 10) {
    numberOfDaysAsInt = 7
  }

  console.log("--> number of day: ")
  console.log(numberOfDaysAsInt)

  return numberOfDaysAsInt + 1;
}


function getCountry(country) {
  var countryList = {
    "ES": 1.3,
    "LU": 1.3,
    "GR": 0.6,
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
        } else if (ages[i] >= 18 && ages[i] < 24) {
            result = result + 0.9;
        } else if (ages[i] >= 24 && ages[i] < 65) {
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

/**
 * Given two dates, calculate the days between the two dates.
 *
 * @param { Date } startdate Initial date.
 * @param { Date } enddate End date.
 * @returns { Number } Number of days between the two dates.
 */
function daysBetween(_startdate, _enddate) {
    var startdate = new Date(_startdate, 'YYYY-MM-DD'); 
    var enddate = new Date(_enddate, 'YYYY-MM-DD'); 

    return Math.round((enddate-startdate)/(1000*60*60*24));
}

