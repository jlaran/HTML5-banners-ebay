//Shared Functions goes here

var customFunctions = {
	"current": "link-one",
	changeTopic: function(){
		if(this.id != customFunctions.current){
			TweenMax.to([".content-image",".copy-text"], 0.01, { opacity:0});
			switch(this.id) {
				case "link-one":
					Enabler.counter('Planner Clicked');
					document.getElementsByClassName("content-image")[0].style.backgroundImage = "url('img/planner-image.jpg')";
					document.getElementsByClassName("copy-text")[0].style.backgroundImage = "url('img/planner-text.jpg')";
					document.getElementsByClassName("here")[0].style.left = "-3px";
					customFunctions.current = this.id;
					break;
				case "link-two":
					Enabler.counter('Accesories Clicked');
					document.getElementsByClassName("content-image")[0].style.backgroundImage = "url('img/accesories-image.jpg')";
					document.getElementsByClassName("copy-text")[0].style.backgroundImage = "url('img/accesories-text.jpg')";
					document.getElementsByClassName("here")[0].style.left = "40px";
					customFunctions.current = this.id;
					break;
				case "link-three":
					Enabler.counter('Notepads Clicked');
					document.getElementsByClassName("content-image")[0].style.backgroundImage = "url('img/notepads-image.jpg')";
					document.getElementsByClassName("copy-text")[0].style.backgroundImage = "url('img/notepads-text.jpg')";
					document.getElementsByClassName("here")[0].style.left = "85px";
					customFunctions.current = this.id;
					break;
				case "link-four":
					Enabler.counter('Decorations Clicked');
					document.getElementsByClassName("content-image")[0].style.backgroundImage = "url('img/decorations-image.jpg')";
					document.getElementsByClassName("copy-text")[0].style.backgroundImage = "url('img/decorations-text.jpg')";
					document.getElementsByClassName("here")[0].style.left = "134px";
					customFunctions.current = this.id;
					break;
				default:
					document.getElementsByClassName("content-image")[0].style.backgroundImage = "url('img/planner-image.jpg')";
					document.getElementsByClassName("copy-text")[0].style.backgroundImage = "url('img/planner-text.jpg')";
					customFunctions.current = this.id;
					break;
			}
			TweenMax.to([".content-image",".copy-text"], .15, { opacity:1, delay:0.1});
		}
    },
    exitCall: function(){
    	Enabler.exit('Clicktag Shop Now');
    }
}