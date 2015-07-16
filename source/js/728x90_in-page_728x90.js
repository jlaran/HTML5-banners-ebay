//JS code goes here

var banner = new Banner({
	bannerType: "in-page",
	timelinesName: ["firstTimeline"],
	elementsToRegister: [
		//{eventType: "click", element: "#identifier", functionToCall: "function"}
	],
	animationFrames: [
		function firstFrame(){
		}
	],
	timelinesToRegister: {
		register: function(){
			banner.timelinesArray[0].to("identifier", 0.2, {opacity:1});
		}
	}
});

//import "sharedFunctions.js"