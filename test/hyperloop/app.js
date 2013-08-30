@import('UIKit/UIApplication');
@import('Foundation/NSLog');

// should throw an error when uncommented
// @foo();

@compiler({
	cflags: ['-DDEBUG=1']
});

var callback = @class(function(sender) {
	NSLog('clicked on button=%@', sender);
});