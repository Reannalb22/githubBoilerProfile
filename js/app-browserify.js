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

	function putInto(property,element,responseObj,image){
		if (image === 1){
			$(element)[0].src = responseObj[property]
		}
		else {
			$(element)[0].innerHTML = responseObj[property];
		}
	}

	var setupPropsOnPage = (responseObj) => {
		console.log(responseObj)
		putInto('avatar_url', '#profilePic', responseObj,1)
		putInto('name','#name',responseObj)
		putInto('login','#login',responseObj)
		putInto('location', '#location',responseObj)
		putInto('email', '#email',responseObj)
		putInto('blog', '#blog',responseObj)
		// putInto('html_url', '#html_url',responseObj)
		// putInDate('created_at', '#created_at',responseObj)
		putInto('followers', '#followers',responseObj)
		putInto('following', '#following',responseObj)
	}


	var formatListEl = (repObj) => {
		console.log(repObj)
		var repoLine = "<a href=" + repObj.html_url + ">" +repObj.name +"</a>"
			repoLine += '<p class= "subInfo">' + repObj.updated_at + '</p>'
		return repoLine;
	}

	var makeRepos = (repoArr) => {
		console.log(repoArr)
		var ulElement = $('#listedRepos')[0];
		ulElement.innerHTML = ''
		
		repoArr.forEach(function(repObj){
			var listElContent = formatListEl(repObj)
			var newRepoItem = document.createElement('li')
			var newLine = document.createElement('hr')
			newRepoItem.innerHTML = listElContent
			ulElement.appendChild(newRepoItem)
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
			success: setupPropsOnPage
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

	var handleInput = function(){
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

	handleInput()

}

