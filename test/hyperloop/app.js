@import('UIKit/UIApplication');
@import('Foundation/NSLog');

@compiler({
	cflags: ['-DDEBUG=1']
});

var callback = @class(function foo(sender) {
	NSLog('clicked on button=%@', sender);
});