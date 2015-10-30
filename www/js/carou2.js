var NT = (function() {

	
	//---------------------------------- CORE --------------//
	/**
	 *	contextualize will look for node with specific tagName
	 *	to transform theme the right way and validate them and
	 *	add comportement.
	 *	
	 *	'this' is the element to checked.
	 *	
	 *	VERSION: 0.1ALPHA
	 *	
	 */
	var order = 0;
	function contextualize() {
//		console.log("contextualize "+this.tagName)
		if (this.nodeType != 3) {
			var childs = this.childNodes;
			for (var i = 0; i < childs.length; i++) {
				contextualize.apply(childs[i]);
			}
			
			for (var i = 0; i < _nogets.length; i++) {
				var noget = _nogets[i];
				if (!this.attributes) { return}
				var attrValue = this.attributes[noget.name];
				if (typeof attrValue !== 'undefined' && attrValue != null) {
					try {
				/*if (noget.name=="nt-table") {
					console.log("WIll apply table on :")
					console.log(this);
				}*/
						noget.onFindWrap(this);
					} catch (e) {
//						console.log(e);
					}
				}
			} 
			
		}
	}
	
	
	/**
	 *	
	 *	
	 *	
	 */

	function Noget(name, onFind, fns) {
		this.name = name;
		this.onFind = onFind;
		this.fns = fns || {};
		this.onFindWrap = function(elem) {
			var val = elem.getAttribute(this.name);
			this.onFind(elem, val);
		}
	}
	
	/**
	 *	
	 *	
	 *	
	 */
	var _nogets = [];
	function addNoget(name, fnOnFind, fns) {
//		console.log("addNoget:"+"nt-"+name);
		_nogets.push(new Noget("nt-"+name, fnOnFind, fns));
	}
	function callNoget(data, name, fnName) {
		var noget = null;
		for (var i = 0; i < _nogets.length; i++) {
			if (_nogets[i].name == "nt-"+name) {
				noget = _nogets[i];
				break;
			}
		}
		if (noget == null) {
			throw "Invalid called noget '"+name+"'";
		}
		
		var fn = noget.fns[fnName];
		
		if (!fn) {
			throw "Invalid called noget '"+name+"' function '"+fnName+"'";
		}
		fn(data);
	}
	/**
	 *	
	 *	
	 *	
	 */

		//INIT
	
	/**
	 *	Making it listening to addNode 
	 *	to ensure it always "contextualize"
	 *	new nodes
	 */
	(function(){
		var exception = "script,style,head,link,"
		function cheatJS(m) {
			var oFn = Element.prototype[m];
			var fnNow = function(node) {
				var e = node;
				var skipContext = arguments[1];
				if (m == "insertBefore") {
					e = arguments[0];
					skipContext = arguments[2];
				}
				
				
				oFn.apply(this,arguments);
				if (exception.indexOf((e.tagName||"#").toLowerCase()) == -1 && !(skipContext===true)) {
		//			let ee = e;
					setTimeout(function() {
						contextualize.apply(e);
					},1)
				}
				return e;
			}
			Element.prototype[m] = fnNow;				
		}

		var methodJs = ["appendChild","insertBefore"]
		for (var i = 0; i < methodJs.length; i++) {
			var m = methodJs[i];
			if ( typeof Element.prototype[m] === 'function') {
				cheatJS(m);
			}
		}
	})();
	
	/**
	 *	Add basic css style to the page
	 */
	var fnCss = (function() {
		function buildSheet() {
			// Create the <style> tag
			var style = document.createElement("style");

			// Add a media (and/or media query) here if you'd like!
			// style.setAttribute("media", "screen")
			// style.setAttribute("media", "only screen and (max-width : 1024px)")

			// WebKit hack :(
			style.appendChild(document.createTextNode(""));

			// Add the <style> element to the page
			document.head.appendChild(style);

			return style.sheet;
		};
		
		var _sheets = {};
		
		function getSheet(sheetName) {
			var sheet = _sheets[sheetName];
			var found = true;
			if (typeof sheet === 'undefined') {
				sheet = buildSheet();
				_sheets[sheetName] = sheet;
				found = false;
			}
			return {sheet: sheet, found: found};
		}
		
		function addCSSRule(sheet, selector, rules, index) {
			if("insertRule" in sheet) {
//				console.log("insert: "+selector + "{" + rules + "}", index);
				sheet.insertRule(selector + "{" + rules + "}", index);
			}
			else if("addRule" in sheet) {
//				console.log("add: "+selector + "{" + rules + "}", index);
				sheet.addRule(selector, rules, index);
			} else {
//				console.log(sheet)
			}
		}
		
		return function(sheetName, selectorORifAlreadyExist, rules) {
			
			if (selectorORifAlreadyExist === true) {
				return typeof _sheets[sheetName] != 'undefined';
			} else {
				var sheet = getSheet(sheetName);
//				console.log("ADD STYLE TO "+sheet)
				addCSSRule(sheet.sheet, selectorORifAlreadyExist, rules);
			}
		};
		
	})();
	
	$(function(){
		contextualize.apply(document.body);
	});
	
	return {
		noget: {
			add : addNoget,
			call: callNoget
		},
		css: fnCss
	};
})();
var count = 0;
(function() {
	
	function counterTableAsTbody(elem) {
		return elem.tagName == "TABLE"?elem.children[0]:elem;
	}
	var carouCounter = 0;
	
	//TODO : ajouter facteur de sensibilité (pour dérouler plus vite que la vitesse du doigt ou de la souris)
	//TODO : ajouter p-e des effets de "smooth"
	//TODO : ajouter un option pour "disabler" la scroll bar
	NT.noget.add(
		"carou",
		function(elem, val) {
			//Check if the element already got "carou"
			if (elem.carouData) {
				throw "Already a carou.. can't be double!"
			}
			
			//Set elem carouData
			var carouData = {
				uid: carouCounter++,
				movement: {
					start: 0,
					goAt: 0
				}
			};
			elem.carouData = carouData;
			
			//Build the container
			var divContainer = document.createElement("DIV");
			var divBoxesContainer = document.createElement("DIV");
			var divButtomBar = document.createElement("DIV");
			var divButtomSubBar = document.createElement("DIV");
			var divButtomSubBarCursor = document.createElement("DIV");
			
			carouData.mainElement = divContainer;
			//Append the maximum things together
			divButtomSubBar.appendChild(divButtomSubBarCursor);
			divButtomBar.appendChild(divButtomSubBar);
			divContainer.appendChild(divBoxesContainer);
			divContainer.appendChild(divButtomBar);
			
			//Placeit justBefore the elem
			elem.parentNode.insertBefore(divContainer, elem);
			
			//Finish appending
			divBoxesContainer.appendChild(elem);
			
			//Set the class
			divContainer.setAttribute("class","nt-carou");
			addClass(divBoxesContainer,"nt-carou-bc");
			addClass(divButtomBar,"nt-carou-bar");
			
			
			carouData.w = function() {
				return elem.offsetWidth
			} 
			carouData.maxW = function() {
				return divBoxesContainer.offsetWidth
			}
			carouData.left = function() {
				return elem.offsetLeft -1;
			}
			
			function pauseEvent(e){
				if(e.stopPropagation) e.stopPropagation();
				if(e.preventDefault) e.preventDefault();
				e.cancelBubble=true;
				e.returnValue=false;
				return false;
			}
			//Apply the event
			function onDown(clientX, evt) {
				var e = evt || window.event;
				pauseEvent(e);
				
				this.carouData.movement.start = clientX;
				this.carouData.movement.startLeft = this.carouData.left();
				this.carouData.movement.on = true;
				this.carouData.movement.countMove = -1;	//-1 to make the first movement count
				divButtomSubBar.setAttribute("class","in-progress");
			}
			function onUp(evt) {
				this.carouData.movement.on = false;
				divButtomSubBar.setAttribute("class","");
				var e = evt || window.event;

			}
			function onMove(clientX,evt) {
				if (this.carouData.movement.on === true) {
					var e = evt || window.event;
					pauseEvent(e);
					this.carouData.movement.countMove++;
					if (this.carouData.movement.countMove % 4 == 0) {
						if (this.carouData.maxW() < this.carouData.w()) {
							this.carouData.movement.goAt = clientX;
							var newPos = (this.carouData.movement.goAt - this.carouData.movement.start) + this.carouData.movement.startLeft;
							//new pos can't be over 0
							var newPos = Math.min(0,newPos);
							//cant be more than the diff of w and maxW
							var diff = this.carouData.maxW() - this.carouData.w();
							newPos = Math.max(newPos, diff);
							this.style.left = newPos+"px";
							
							//positionning the fake scrollbar
							var sleft = Math.abs(newPos) / this.carouData.w() *100;
							var sw = this.carouData.maxW() / this.carouData.w() *100;
							divButtomSubBarCursor.style.left = sleft+"%";
							divButtomSubBarCursor.style.width = sw+"%";
						} else {
							divButtomSubBarCursor.style.left = "0%";
							divButtomSubBarCursor.style.width = "100%";
						}
					}
				}
			}
			
			function onDownM(evt) {
				var clientX = evt.clientX;
				onDown.apply(this,[clientX, evt]);
			}
			function onUpM(evt) {
				onUp.apply(this,[evt]);
			}
			function onDownT(evt) {
				var clientX = evt.touches[0].clientX;
				onDown.apply(this,[clientX, evt]);
			}
			function onMoveM(evt) {
				var clientX = evt.clientX;
				onMove.apply(this,[clientX, evt]);
			}
			function onMoveT(evt) {
				var clientX = evt.touches[0].clientX;
				onMove.apply(this,[clientX, evt]);
			}
			
			elem.addEventListener("mousedown",onDownM);			
			elem.addEventListener("mouseup",onUpM);
			elem.addEventListener("mousemove",onMoveM);
			elem.addEventListener("touchstart",onDownT);
			elem.addEventListener("touchend",onUp);
			elem.addEventListener("touchmove",onMoveT);
			document.addEventListener("mouseup",function() {
				onUp.apply(elem);
			});
	
		}
	)
	
	/**
	 *	Automaticly mean that all element will finish at the same size
	 *	in the thumbsnail
	 **/
	NT.noget.add(
		"carou-display",
		function(elem, val) {
			//Check if the element already got "carou"
			if (!elem.carouData) {
				throw "Need to be a carou.. can't work without!"
			}
			if (elem.carouData.display) {
				throw "Already a carou display.. can't be double!"
			}			
			carouData = elem.carouData;
			
			//Build the container
			var divDisplayMainBig = document.createElement("DIV");
			var divDisplayImgWrapBig = document.createElement("DIV");
			
			var divDisplayMain = document.createElement("DIV");
			var divDisplayImgWrap = document.createElement("DIV");
			
			addClass(divDisplayMain,"nt-carou-display");
			addClass(divDisplayMainBig,"nt-carou-display-big");

			divDisplayMain.appendChild(divDisplayImgWrap)
			divDisplayMainBig.appendChild(divDisplayImgWrapBig)
			
			document.body.appendChild(divDisplayMainBig);
			
			var dc = carouData.mainElement.querySelector(".nt-carou-bc");
			carouData.mainElement.insertBefore(divDisplayMain,dc);
			carouData.display = divDisplayMain;
			
			$(elem).delegate("*","click touchend",function(evt) {
					showTheElement(this);
			});
			if (elem.children.length > 0) {
				showTheElement(elem.children[0]);
			}
			
	/*		for (var i = 0; i < elem.children.length; i++) {
				if (i == 0) {
					showTheElement(elem.children[0]);
				}
				elem.children[i].addEventListener("click",function(evt) {
					console.log(evt);
					showTheElement(this);
				});
			}*/
			
			divDisplayMainBig.addEventListener("click",function(evt) {
				hideBigDisplay()
			});
			divDisplayImgWrap.addEventListener("click",function(evt) {
				showBigDisplay()
			});
			divDisplayMainBig.addEventListener("touchend",function(evt) {
				evt.stopPropagation();
				evt.preventDefault();
				hideBigDisplay()
			});
			divDisplayImgWrap.addEventListener("touchend",function(evt) {
				evt.stopPropagation();
				evt.preventDefault();
				showBigDisplay()
			});
			
			function showBigDisplay() {
				divDisplayMainBig.style.display="block";
				var h = divDisplayMainBig.offsetHeight;
				var hw = divDisplayImgWrapBig.offsetHeight;
				var dif = (h-hw)/2;
				divDisplayImgWrapBig.style.marginTop = dif+"px"
			}
			function hideBigDisplay() {
				divDisplayMainBig.style.display="none"
			}
			
			function showTheElement(elem) {
				//1- removed all child
				while (divDisplayImgWrap.childNodes.length > 0 ) {
					divDisplayImgWrap.removeChild(divDisplayImgWrap.childNodes[0]);
				}
				while (divDisplayImgWrapBig.childNodes.length > 0 ) {
					divDisplayImgWrapBig.removeChild(divDisplayImgWrapBig.childNodes[0]);
				}
				
				//2- clone elem and put it in
				var clone = elem.cloneNode(true);
				var clone2 = elem.cloneNode(true);
				
				//3- push the clone
				divDisplayImgWrap.appendChild(clone);
				divDisplayImgWrapBig.appendChild(clone2);
				
				//4- make other unselected
				for (var i = 0; i < elem.parentNode.children.length; i++) {
					removeClass(elem.parentNode.children[i],"nt-selected")
				}
				addClass(elem, "nt-selected");
				
				//5- if elem is an image, we gonna do some magic trick
				if (clone.tagName == 'IMG') {
					clone.removeAttribute("width");
					clone.style.width = "";
					clone2.setAttribute("width","100%");
					clone2.style.width = "";
				}
			//var divDisplayImg = document.createElement("IMG");
			}
			
		}
	)

	/**
	 *	Automaticly mean that all element will finish at the same size
	 *	in the thumbsnail
	 **/
	NT.noget.add(
		"carou-landscape",
		function(elem, val) {
			//Check if the element already got "carou"

			if (!elem.carouData) {
				throw "Need to be a carou.. can't work without!"
			}
			carouData = elem.carouData;
			
			var dc = carouData.mainElement.querySelector(".nt-carou-bc");
			
			var values = val.split(";");
			for (var i = 0; i < values.length; i++) {
				values[i] = parseInt(values[i]) || 5;
			}
			carouData.landscapeSetting = carouData.landscapeSetting || {};
			carouData.landscapeSetting.landscape = values[0];
			carouData.landscapeSetting.portrait = values[1];
			carouData.landscapeSetting.status = 0;
			
			if (!carouData.landscapeSetting.onResize) {
				function onResize(/*force*/) {
//					force = force === true;
					var body = document.body;
					var html = document.documentElement;

					var h = window.innerHeight;//Math.max( body.scrollHeight, body.offsetHeight, 
										 //  html.clientHeight, html.offsetHeight );

					var w = window.innerWidth;//Math.max( body.offsetWidth, html.clientWidth, html.offsetWidth );
					
					var status = h > w;
//					var change = carouData.landscapeSetting.status !== status;
//					if (change || force) {
						console.log("change size: "+elem.children.length)
						carouData.landscapeSetting.status = status;
						var wP = 0.2;
						if (status) {
							wP = 1/carouData.landscapeSetting.landscape;
						} else {
							wP = 1/carouData.landscapeSetting.portrait;
						}
						
						var wx = wP*elem.parentNode.offsetWidth;
						for(var i = 0; i < elem.children.length; i++) {
							if (elem.children[i].tagName == 'IMG') {
								elem.children[i].setAttribute("width", wx+"px");
							}
							elem.children[i].style.width = wx+"px";
						}
					//}
				}
				carouData.landscapeSetting.onResize = onResize;
				window.addEventListener("resize", carouData.landscapeSetting.onResize);
			}
			carouData.landscapeSetting.onResize();
		}
	)

	function addClass(elem, className) {
		className = className || "";
		className = className.trim();
		if (!className) return;
		var cval = elem.getAttribute("class") || "";
		cval = cval.split(" ");
		
		var alreadyThere = false;
		var newVal = "";
		for (var i = 0; i < cval.length; i++) {
			var c = cval[i].trim();
			
			if (c == className) {
				alreadyThere = true;
				break;
			} else if ( c.length > 0) {
				newVal += (newVal.length==0?"":" ")+c;
			}
			
		}
		
		newVal += (newVal.length==0?"":" ")+className;
		elem.setAttribute("class", newVal)
		
	}
	function removeClass(elem, className) {
		className = className || "";
		className = className.trim();
		if (!className) return;
		var cval = elem.getAttribute("class") || "";
		cval = cval.split(" ");
		
		var alreadyThere = false;
		var newVal = "";
		for (var i = 0; i < cval.length; i++) {
			var c = cval[i].trim();
			
			if (c.length > 0 && c != className) {
				newVal += (newVal.length==0?"":" ")+c;
			}
		}
		
		elem.setAttribute("class", newVal)
	}
})();
