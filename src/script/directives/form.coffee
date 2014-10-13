app.directive 'focus', () ->
	restrict: 'A'
	link: (scope, element, attrs) ->
		element[0].focus()
