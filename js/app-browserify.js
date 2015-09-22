// es5 and 6 polyfills, powered by babel
require("babel/polyfill")

let fetch = require('./fetcher')

var $ = require('jquery'),
	Backbone = require('backbone')
// other stuff that we don't really use in our own code
// var Pace = require("../bower_components/pace/pace.js")

// require your own libraries, too!
// var Router = require('./app.js')

// window.addEventListener('load', app)

// function app() {
    // start app
    // new Router()
// }

window.onload = function(){
	var urlRoot= 'https://api.github.com/users/'

	var createProfile = function(responseObj) {
		console.log(responseObj);

		$("#profilePic").attr("src",responseObj.avatar_url);
		$("#login")[0].innerHTML = responseObj.login; 
		$("#name")[0].innerHTML = responseObj.name;
		$('#created_at')[0].innerHTML = `Joined ${responseObj.created_at}`;
		$("#followers")[0].innerHTML = `<span> ${responseObj.followers} </span> <br> <p> Followers </p>`;
		$("#starred")[0].innerHTML = `<span> 0 </span> <br> <p> Starred </p>`;
		$("#following")[0].innerHTML =  `<span> ${responseObj.following} </span> <br> <p> Following </p>`; 
	}


	var makeRepos = (repoArr) => {
		console.log(repoArr)
		var ulElement = $('#listedRepos')[0];
		ulElement.innerHTML = ''
		
		repoArr.forEach(function(repObj){
			var newLine = document.createElement('hr')
			ulElement.innerHTML += "<div class = repos>" + "<a href=" + repObj.url + " class = repoName>" + repObj.name + "</a>" + "<br>" + "<p class = createdOn>" + repObj.created_at + "</p>"
			ulElement.appendChild(newLine)
		})
	}


	var doAjax = (query) => {
		var ajaxParamsRepo = {
			url: urlRoot + query.replace('#', '') + '/repos',
			success: makeRepos
		}

		$.ajax(ajaxParamsRepo)

		var ajaxParams = {
			url: urlRoot + query.replace('#', ''),
			success: createProfile
		}
		
		$.ajax(ajaxParams)
	}

	var getUserQuery = (event) => {
		console.log(event)
		if(event.keyCode === 13){
			var inputEl = event.srcElement
			var query = inputEl.value
			inputEl.value = ''
			location.hash = `users/${query}`
		}
	}

	var githubRouter = Backbone.Router.extend({
		'routes': {
			'users/:query': 'showSearchResults',
			'*anyroute': 'showDefault'
		},

		showDefault: () => {
			doAjax('reannalb22')
		},

		showSearchResults: (query) => {
			doAjax(query)
		},

		initialize: () => {
			Backbone.history.start()
		}
	})

	var thisRouter = new githubRouter()

	var changeUser = () => {
		var inputEl = $('input')[0]
		inputEl.onkeypress = getUserQuery
		var query = location.hash
		console.log(query);
		doAjax(query)
	}

	// window.onhashchange = function(){
	// 	var query = location.hash
	// 	console.log(location.hash)
	// 	doAjax(query)
	// }

	changeUser()

}

