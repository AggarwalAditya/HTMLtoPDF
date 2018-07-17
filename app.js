var Helper = (function(){

	var foundImage = function(elem)
	{
		return (elem.nodeName.toLowerCase() === 'img');
	}

	var foundTable = function(elem)
	{
		return (elem.nodeName.toLowerCase() === 'table');
	}

	var foundAnchor = function(elem)
	{
		return (elem.nodeName.toLowerCase() === 'a');	
	}

	return{
		foundImage : foundImage,
		foundTable : foundTable,
		foundAnchor : foundAnchor
	};

})();

var HTMLtoPDF = (function(){

		var isTable = function(elem,doc,y)
		{

			let numRows = elem.rows.length;
			let numCols = elem.rows[0].cells.length;

			let rows = new Array(numRows);
			let cols=new Array(numCols);
			for(let i=1;i<numRows;i++)
			{
				rows[i] = new Array(numCols); 
			}

			for(let i=0;i<numCols;i++)
			{
				cols[i]=elem.rows[0].cells[i];
			}

			for(let i=1;i<numRows;i++)
			{
				for(let j=0;j<numCols;j++)
				{
					rows[i][j]=elem.rows[i].cells[j];
				}
			}

			doc.autoTable(cols,rows,{
			startY:y+40
			});

		}

		var isText = function(elem,doc,x,y,i)
		{
				var options = 
	   			{
	         		pagesplit: true
	    		};

      		var margins = {
                              top: 40,
                              bottom: 60,
                              left: 40,
                              width: 522
                           };
				var specialElementHandlers = 
				{
		    		'#editor': function (element, renderer) 
		    		{
		        		return true;
		    		}
				};

				doc.fromHTML(elem,x, y, {
			       		'width': doc.internal.pageSize.width-20 ,
			           		'elementHandlers': specialElementHandlers
		    		},options,margins);
		}

		return {
			isTable : isTable,
			isText : isText
		};

})();

$(document).ready(function(){

		let all = $("#content").children();

		let x=15;
		let y=15;

		let doc = new jsPDF('p', 'pt', 'a4');
		var options = 
	   			{
	         		pagesplit: true
	    		};

				var specialElementHandlers = 
				{
		    		'#editor': function (element, renderer) 
		    		{
		        		return true;
		    		}
				};

		for(let i=0;i<all.length;i++)
		{
			let elem=all[i];

			if(Helper.foundTable(elem))
			{
				if(i!=0)
				{
					y = y + all[i-1].offsetHeight+40;

				}

				if((y+all[i].offsetHeight+60) > doc.internal.pageSize.height)
			    {
	        		doc.addPage();
	        		y=15;
	      		}

				HTMLtoPDF.isTable(elem,doc,y);
			}

			else if(Helper.foundImage(elem))
			{

				function toDataUrl(src, callback, outputFormat) 
				{
                	var img = new Image();
                	img.setAttribute('crossOrigin', 'anonymous');
                	img.onload = function () 
                	{

                   		/*image completely converted to base64string */
                    	var canvas = document.createElement('CANVAS');
                    	var ctx = canvas.getContext('2d');
                    	var dataURL;
                    	canvas.height = this.height;
                    	canvas.width = this.width;
                    	ctx.drawImage(this, 0, 0);
                    	dataURL = canvas.toDataURL(outputFormat);

                    	/* call back function */
                    	callback(dataURL);
                	};
                	img.src = src;
                
            	}



  				function callbackBase64(base64Img)
    			{
           			/*base64Img contains full base64string of image   */
           			console.log(base64Img);
           			doc.addImage(base64Img,'JPG',45,45,150,150);
           			
    			}

				toDataUrl(elem.src, callbackBase64, "image/jpg");
			}

			else
			{

				if(i!=0)
				{
					
					y = y + all[i-1].offsetHeight+20;
					
					if((y+all[i].offsetHeight+60) > doc.internal.pageSize.height)
			      	{
			       		doc.addPage();
			       		y=15;
			   		}
				}

				HTMLtoPDF.isText(elem,doc,x,y,i);	

			}
		}

		doc.save("policypdf.pdf");

});