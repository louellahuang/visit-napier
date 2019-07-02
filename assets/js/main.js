const accom = 
[
	{
		type: 'hotel',
		src:'assets/img/masonic-hotel1.jpg',
		alt:'Art Deco Masonic Hotel',
		text: 'Napier’s best located Boutique Hotel, on the waterfront with panoramic views of the Pacific Ocean – Masonic Hotel is an Art Deco jewel offering unique, characterful Napier accommodation options.',
		minPeople: 1,
		maxPeople: 2,
		minNights: 1,
		maxNights: 5,
		price: 157
	},
	{
		type: 'hostel',
		src:'assets/img/criterion-backpacker1.jpg',
		alt:'Criterion Art Deco Backpackers',
		text: 'Unique Spanish Mission/Art Deco Style building Located in the heart of Napier and just minutes from the Visitor Information Center( i-Site), the Criterion Art Deco Backpackers is Hawkes Bay premier Hostel.',
		minPeople: 1,
		maxPeople: 1,
		minNights: 1,
		maxNights: 10,
		price: 30
	},
	{
		type: 'motel',
		src:'assets/img/beach-front-motel1.jpg',
		alt:'Beach Front Motel Napier',
		text: 'Our location is unbeatable on Napier\'s famous Marine Parade which runs alongside the magnificent Pacific Ocean, with its views to Mahia Peninsula to the north and Cape Kidnappers to the south.',
		minPeople: 2,
		maxPeople: 4,
		minNights: 3,
		maxNights: 10,
		price: 90
	},
	{
		type: 'house',
		src:'assets/img/colenso-cottage1.jpg',
		alt:'Historic Colenso Cottage',
		text: 'Colenso Cottage is set in a fantastic location with stunning views just outside the front door. A romantic, relaxing retreat within a short walk of town.',
		minPeople: 1,
		maxPeople: 4,
		minNights: 2,
		maxNights: 15,
		price: 240
	}
];

const mealOptions = 
[
	{
		src:'assets/img/meal/pacifica.jpg',
		restaurantName: 'Pacifica Kaimoana',
		mealName: '5 Course Degustation Menu',
		price: 65
	},
	{
		src:'assets/img/meal/bistronomy.jpg',
		restaurantName: 'Bistronomy',
		mealName: 'chef’s choice | 6 courses',
		price: 75
	},
	{
		src:'assets/img/meal/emporium.jpg',
		restaurantName: 'Emporium Eatery & Bar',
		mealName: 'Grilled Beef Rib Eye Steak',
		price: 36
	}
];

let stayDays;
let totalPriceAccom;
let totalMealPrice;
let selectedAccomId;
let selectedMealId;

// Loads page first, then runs functions
$(function() {
	"use strict";
	initDatePicker();
	populate();
	$('#template .accomodation').remove();
});

//populate data into HTML
function populate(){
	//populate cards for accommodation
	for (let i = 0; i < accom.length; i++) {
		let accomItem = accom[i];
		//clone HTML
		const htmlTemp = $('#template .accomodation').first().clone();
		// injecting HTML dynamically
		htmlTemp.find('.card-img-top').attr({src: accomItem.src, alt: accomItem.alt});
		htmlTemp.find('.card-title').text(accomItem.alt);
		htmlTemp.find('.card-subtitle').text('NZ$'+accomItem.price);
		htmlTemp.attr('id','accom-' + i );
		//hide cards until search is run
		htmlTemp.addClass('hide');
		htmlTemp.appendTo('#results');

		// populate modal for accom on button click
		htmlTemp.find('.accom-link').click(function(){
			$('.accomodation-modal .accom-desc').text(accomItem.text);
			$('.accomodation-modal .accom-title').text(accomItem.alt);
			$('.accomodation-modal .accom-img').attr({id: 'accom-'+i, src: accomItem.src, alt: accomItem.alt});
			$('.accomodation-modal .accom-price').text('NZD$'+accomItem.price);

			totalPriceAccom = accomItem.price * stayDays;
			console.log(totalPriceAccom);
		});
	}
}

//initialising date picker plugin
function initDatePicker() {
	$('#date-picker').daterangepicker({
		//options for the plugin
		"locale": {
		        "format": "DD/MM/YYYY"
		    },
		"maxSpan": {
		    "days": 15
		},
		"autoApply": true,
		'opens': 'center',
		"minYear": 2018,
		"maxYear": 2022,
		"showCustomRangeLabel": false
		//callback function to perform filtering
	}
	// ,function(start, end, label) {
	// 	//filter with this value
	// 	userInputDate = Math.round((end-start)/(1000*60*60*24));
	// 	userInputDateUpdated = userInputDate - 1;
	// }

	);
}

// change value of Guest input with buttons
$('#button-minus').click(function(){
	// change value by minusing 1
	let guestInput = parseInt($('#qty-input').val());
	guestInput -= 1;
	// a -= 1;
	// a = a -1;
	if (guestInput < 1){
		guestInput = 1;
		$('#qty-input').val(guestInput);
	} else {
		$('#qty-input').val(guestInput);
	}
});

$('#button-plus').click(function(){
	// change value by adding 1
	let guestInput = parseInt($('#qty-input').val());
	guestInput += 1;
	if (guestInput >= 4){
		guestInput = 4;
		$('#qty-input').val(guestInput);
	} else {
		$('#qty-input').val(guestInput);
	}
});

// filter with search button
$('.btn-search').click(function(e){
	//prevent submitting
	e.preventDefault();
	// filtering
	$('#accom').removeClass('hide');
	filter();
});

//filtering
function filter(){
	//grab number of days from the datepicker plugin
	stayDays = 	$("#date-picker").data('daterangepicker').endDate.diff($("#date-picker").data('daterangepicker').startDate, 'days');

	//hide 'no results' card
	$('#no-results').addClass('hide');
	//create flag to check if all cards are hidden everytime the search button is clicked
	let allHidden = true;
	for (let i = 0; i < accom.length; i++) {
		// reset search by adding class of hide
		$('#accom-'+i).addClass('hide');
		//filtering by Date && by Guest
		let guestInput = parseInt($('#qty-input').val());
		let filterDate = stayDays >= accom[i].minNights && stayDays <= accom[i].maxNights;
		let filterGuest = guestInput >= accom[i].minPeople && guestInput <= accom[i].maxPeople;
		if (filterDate && filterGuest){
			$('#accom-'+i).removeClass('hide');
			// At least one card has been revealed so not everything is hidden
			allHidden = false;
		}
	}
	//If statement that checks that allHidden is true
	if (allHidden){
		// Now reveal the no-results card
		$('#no-results').removeClass('hide');
	}
}

//div scroll on 'Add Meal' button click. Refer to answer below
//https://stackoverflow.com/a/19012631
$('#bookAccom').click(function(){
	//reveal meal div
	$('#meal').removeClass('hide');
	//Jump to div of #meal
	$('html, body').animate({
        scrollTop: $("#meal").offset().top
    }, 1000);

	// get selected accomodation id from modal
    selectedAccomId = $('.accomodation-modal .accom-img').attr('id');
    //takes last char of Id (which is the object array index)
    selectedAccomId = parseInt(selectedAccomId[selectedAccomId.length -1]);
    console.log(selectedAccomId);
});

//populate meal modal
for(let i = 0; i < mealOptions.length; i++) {
	$('#meal-'+i+' .meal-link').click(function(){
		//adding id to meal modal to target array index
		$('.meal-img').attr({id: 'meal-'+i, src: mealOptions[i].src, alt: mealOptions[i].restaurantName});
		$('#restaurantName').text(mealOptions[i].restaurantName);
		$('#meal-desc').text(mealOptions[i].mealName);
		$('.meal-price').text('$'+mealOptions[i].price);
	});
}

//div scroll on 'cancelMeal' button click to reveal confirmation div
$('#skipMeal, #cancelMeal').click(function(){
	//reveal confirmation div
	$('#confirmation').removeClass('hide');
	//Jump to div of #confirmation
	$('html, body').animate({
        scrollTop: $("#confirmation").offset().top
    }, 1000);

	// get selected accomodation id from modal
    selectedAccomId = $('.accomodation-modal .accom-img').attr('id');
    //takes last char of Id (which is the object array index)
    selectedAccomId = parseInt(selectedAccomId[selectedAccomId.length -1]);

    // populate confirmation div cards
    // datepicker data
    let startDate = $("#date-picker").data('daterangepicker').startDate.format('Do MMM YYYY');
    let endDate = $("#date-picker").data('daterangepicker').endDate.format('Do MMM YYYY');
    $('#confirmation .stay-dates').text('Your stay from: '+startDate+' - '+endDate);
    // populate accom card
    $('#confirmation .chosen-accom-card img').attr({src: accom[selectedAccomId].src, alt: accom[selectedAccomId].alt});
    $('#confirmation .chosen-accom-card .chosen-hotel').text(accom[selectedAccomId].alt);
    $('#confirmation .chosen-accom-card .total-accom-price').text('Total Price $'+totalPriceAccom);
    // total stay price
    $('#confirmation .total-price').text('Final Price: $'+totalPriceAccom);
});

// change value of meal input with buttons
$('#meal-button-minus').click(function(){
	// change value by minusing 1
	let mealInput = parseInt($('#meal-qty-input').val());
	mealInput -= 1;
	// a -= 1;
	// a = a -1;
	if (mealInput < 1){
		mealInput = 1;
		$('#meal-qty-input').val(mealInput);
	} else {
		$('#meal-qty-input').val(mealInput);
	}
});

$('#meal-button-plus').click(function(){
	let guestInput = parseInt($('#qty-input').val());
	// change value by adding 1
	let mealInput = parseInt($('#meal-qty-input').val());
	mealInput += 1;
	//max mealInput must be no greater than total guests
	if (mealInput >= guestInput){
		mealInput = guestInput;
		$('#meal-qty-input').val(mealInput);
	} else {
		$('#meal-qty-input').val(mealInput);
	}
});

//div scroll on 'addMeal' button click to reveal confirmation div
$('#addMeal').click(function(){
	//reveal confirmation div
	$('#confirmation').removeClass('hide');
	//reveal chosen meal div
	$('.chosen-meal-card').removeClass('hide');
	//Jump to div of #confirmation
	$('html, body').animate({
        scrollTop: $("#confirmation").offset().top
    }, 1000);
	//calculating meal price * how many meals
	let mealPrice = parseInt($('#mealModal .meal-price').text().substr(1));
	let mealInput = parseInt($('#meal-qty-input').val());
	totalMealPrice = mealPrice * mealInput;
	// console.log(totalMealPrice);

	// get selected meal id from modal
	selectedMealId = $('#mealModal .meal-img').attr('id');
	//takes last char of Id (which is the object array index)
    selectedMealId = parseInt(selectedMealId[selectedMealId.length -1]);
    // console.log(selectedMealId);

	// populate confirmation div cards
	// datepicker data
	let startDate = $("#date-picker").data('daterangepicker').startDate.format('Do MMM YYYY');
	let endDate = $("#date-picker").data('daterangepicker').endDate.format('Do MMM YYYY');
	$('#confirmation .stay-dates').text('Your stay from: '+startDate+' - '+endDate);
	// populate accom card
	$('#confirmation .chosen-accom-card img').attr({src: accom[selectedAccomId].src, alt: accom[selectedAccomId].alt});
	$('#confirmation .chosen-accom-card .chosen-hotel').text(accom[selectedAccomId].alt);
	$('#confirmation .chosen-accom-card .total-accom-price').text('Total Price $'+totalPriceAccom);
	// populate meal card
	$('#confirmation .chosen-meal-card img').attr({src: mealOptions[selectedMealId].src, alt: mealOptions[selectedMealId].restaurantName});
	$('#confirmation .chosen-meal-card .chosen-meal').text(mealOptions[selectedMealId].restaurantName);
	$('#confirmation .chosen-meal-card .chosen-meal-name').text(mealOptions[selectedMealId].mealName);
	$('#confirmation .chosen-meal-card .total-meal-price').text('Total Price $'+totalMealPrice);
	// calculate total stay price
	let totalStayPrice = totalPriceAccom + totalMealPrice;
	$('#confirmation .total-price').text('Final Price: $'+totalStayPrice);
});