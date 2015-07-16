//JS code goes here

var banner = new Banner({
	bannerType: "in-page",
	timelinesName: ["firstTimeline", "secondTimeline", "thridTimeline"],
	elementsToRegister: [
		{eventType: "click", element: ".link-menu", functionToCall: "customFunctions.changeTopic"},
		{eventType: "click", element: "#cta", functionToCall: "customFunctions.exitCall"}
	],
	animationFrames: [
		function firstFrame(){
			banner.timelinesArray[0].play();
		},
		function secondFrame(){
			banner.timelinesArray[1].play();
			banner.timelinesArray[2].play();
		}
	],
	timelinesToRegister: {
		register: function(){
			banner.timelinesArray[0].to("#initial-load", 0.2, {opacity:0, delay: 1, onComplete: banner.animationFrames[1]});

			banner.timelinesArray[1].to(["#menu","#content"], 0.2, {opacity:1});

			banner.timelinesArray[2].to(["#cta"], 0.2, {opacity:1, delay: 0.5});
		}
	}
});

//import "sharedFunctions.js"