@import('UIKit/UIApplication', 'another', []);
@import('Foundation/NSLog');

// should throw an error when uncommented
// @foo();

@compiler({
	cflags: ['-DDEBUG=1']
});

var callback = @class('someClass', ['f','g'], function foo(sender) {
	NSLog('clicked on button=%@', sender);
});