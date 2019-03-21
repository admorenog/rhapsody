const remote = require( 'electron' ).remote

var Menu = remote.Menu
var MenuItem = remote.MenuItem

// Build our new menu
var menu = new Menu()
menu.append(new MenuItem({
  label: 'Delete',
  click: function() {
    // Trigger an alert when menu item is clicked
    alert('Deleted')
  }
}))
menu.append(new MenuItem({
  label: 'More Info...',
  click: function() {
    // Trigger an alert when menu item is clicked
    alert('Here is more information')
  }
}))

window.onload = init;

function init()
{
	// Add the listener
	document.addEventListener('DOMContentLoaded', function () {
		console.debug( document.querySelector('.js-context-menu') );
		menu.popup(remote.getCurrentWindow());
		document.querySelector('.js-context-menu').addEventListener('click', function (event) {
		})
	})
}
