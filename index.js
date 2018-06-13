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


$(document).ready(function(){



		var all = $("#content").children();

		let x = 15;
		let y = 15;
		
		var doc = new jsPDF('p', 'pt', 'a4');

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

		for (var i=0, max=all.length; i < max; i++) 
		{
			console.log(all[i]);
			let elem=all[i];

			if(Helper.foundTable(all[i]))
			{
				if(i!=0)
				{
					y = y + all[i-1].offsetHeight+30;
				}
				
				if((y+all[i].offsetHeight) > doc.internal.pageSize.height)
			      		{
			      			console.log("aa");
			        		doc.addPage();
			        		y=15;
			      		}

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
					

			else
			{
				if(i==0)
				{
			    		doc.fromHTML(all[0], x, y, {
			        		'width': doc.internal.pageSize.width-20 ,
			            		'elementHandlers': specialElementHandlers
			      		},options); 
				}

				else
				{
						y = y + all[i-1].offsetHeight+20;

						console.log("y= "+y+" "+(typeof(y)));
						console.log("offset height= "+all[i].offsetHeight+" "+(typeof(all[i].offsetHeight)));
						console.log("doc size= "+doc.internal.pageSize.height+" "+(typeof(doc.internal.pageSize.height)));

			      		if((y+all[i].offsetHeight) > doc.internal.pageSize.height)
			      		{
			      			console.log("aa");
			        		doc.addPage();
			        		y=15;
			      		}


			      		doc.fromHTML(all[i], x, y, {
			        		'width': doc.internal.pageSize.width-20 ,
			            		'elementHandlers': specialElementHandlers
			      		},options);
				}
			}
			


		}

		doc.save("pdftest.pdf");
});