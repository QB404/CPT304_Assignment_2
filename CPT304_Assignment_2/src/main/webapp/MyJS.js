         var countryjson;
         var cityjson;
         var currentcountry;
         var currentcity;
         var currentcityid;
         var currentcity_lat;
         var currentcity_lon;
            //acquire holidays
          async  function request_holiday(country_code) {

                const url = 'https://public-holiday.p.rapidapi.com/2023/'+country_code;
                const options = {
                	method: 'GET',
                	headers: {
                		'X-RapidAPI-Key': '218ef62867msh43435c3235a761dp1ad0ddjsne502f1a15b2f',
                		'X-RapidAPI-Host': 'public-holiday.p.rapidapi.com'
                	}
                };

                try {
                	const response = await fetch(url, options);
                	const result = await response.json();
                	var temp="";
                	
                	for(var i=0;i<result.length;i++){temp+=JSON.stringify(result[i].date)+JSON.stringify(result[i].name)+'\n';}                	
                 	//write modified result into the webpage
                	document.getElementById("result").innerText = temp;
                	//update selection list
                	showList(result,"holidayform","holidaylist","holiday","get_holiday()");
                } catch (error) {
					//error means no result
					document.getElementById("result").innerText = 'No holiday can be fonud for this country.'+'\n'+'Recommand:Popular country for a tour: China,America,Australia, Japan......';                	
                	showList('',"holidayform","holidaylist","holiday","get_holiday()");
                	console.error(error);
                }                                                       
            }
            
            async function request_hotel(date, cityid){
				if(null==currentcityid){//null id means the city is not in database
					document.getElementById("hotelresult").innerText = 'This city is not include in the database for hotel';
					return }
				      const str=date.split('-');
				      
				      var temp= parseInt(str[2])+1;if(temp<10){temp="0"+temp.toString(10);}
				      
				      var checkin=str[0]+'-'+str[1]+'-'+str[2];
				      var checkout=str[0]+'-'+str[1]+'-'+temp;
				      const url = 'https://priceline-com-provider.p.rapidapi.com/v1/hotels/search?date_checkout='+checkout+'&sort_order=HDR&location_id='+cityid+'&date_checkin='+checkin+'&rooms_number=1&star_rating_ids=3.0%2C3.5%2C4.0%2C4.5%2C5.0';
                      const options = {
	                  method: 'GET',
	               headers: {
	               	'X-RapidAPI-Key': '218ef62867msh43435c3235a761dp1ad0ddjsne502f1a15b2f',
	               	'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com'
	               }
               };

               try {
               	const response = await fetch(url, options);
               	const result = await response.json();
               	
               	if(result.hotels[0].name==undefined||result.hotels[0].name==null)(console.log(result.hotels[1].name));
               	var hotel="";
               	for(var i=0;i<result.hotels.length;i++){
				if(result.hotels[i].name!=undefined && result.hotels[i].name!=null)(
					hotel+='Hotel:'+result.hotels[i].name+'     Rating:'+result.hotels[i].starRating+'     Addr:'+result.hotels[i].location.address.addressLine1+'\n'
					);
					//write modified result into the webpage
					document.getElementById("hotelresult").innerText = hotel;   
				   }				                                             	
               } catch (error) {
				   //error means not info about hotel
				   document.getElementById("hotelresult").innerText='Can not find hotel data.';				   
	               console.error(error);
               }
				
			}
          //function for update selection list
         async function showList(arr,formname,id,name,trigger){
			  
          	var str="";
              var head ="<form name="+formname+" action=\"\">";
              var end="</form>"
          	for(var i=0;i<arr.length;i++){str+="<option value="+JSON.stringify(arr[i].date)+">"+JSON.stringify(arr[i].date)+JSON.stringify(arr[i].name)+"</option>";}
          	document.getElementById(id).innerHTML=head+"<select name=\""+name+"\" onchange="+trigger+">"+str+"</select>"+end;
          }
            
            
            async function get_weather(city,date){				
				const str=date.split('-');
				const url = 'https://weatherbit-v1-mashape.p.rapidapi.com/forecast/daily?lat='+currentcity_lat+'&lon='+currentcity_lon;
                 const options = {
	                 method: 'GET',
	                 headers: {
	                 	'X-RapidAPI-Key': '218ef62867msh43435c3235a761dp1ad0ddjsne502f1a15b2f',
	                 	'X-RapidAPI-Host': 'weatherbit-v1-mashape.p.rapidapi.com'
	                 }
                 };

                 try {
	                 const response = await fetch(url, options);
	                 const result = await response.json();
	                 document.getElementById("weather").innerText='Can not find data about weather ';
	                 for(var i=0;i<result.data.length;i++)
	                 {
						 var temp =result.data[i].datetime.split('-');
						 if(parseInt(temp[0])==parseInt(str[0])&&parseInt(temp[1])==parseInt(str[1])  && parseInt(temp[2])==parseInt(str[2]) )
						 {document.getElementById("weather").innerText=
						 'Min temp:'+result.data[i].app_min_temp+'\n'+
						 'Max temp:'+result.data[i].app_max_temp+'\n'+
						 'Avg temp:'+result.data[i].temp+'\n'+
						 'Describe by:'+result.data[i].weather.description+'\n'
						 ;}//write modified result into the webpage
					 }
	                 console.log(result.data[0]);
                 } catch (error) {
					 //weather has a very low times of access limit 
					 document.getElementById("weather").innerText='Can not find data about weather '+'\n'+'(could be the limit of times this api can be called)';
	                 console.error(error);
                 }	}
                 //activate when selection of country change
            function get_country()
            {
             
                var opObject=document.countryForm.country;
                  document.getElementById("weather").innerText='';
                         document.getElementById("hotelresult").innerText='';
                //获取选中的值


                for(var i=0;i<opObject.length;i++)
                {
                    if(opObject.options[i].selected)
                    {
                        alert(opObject.options[i].text);
                        citylist(opObject.options[i].text);
                        request_holiday(opObject.options[i].value);
                        currentcountry=opObject.options[i].text;
                    }
                    
                }                                              
                
            }
            //activate when selection of city change
         async   function get_city(){
				var opObject=document.cityForm.city;

                //获取选中的值
                        document.getElementById("weather").innerText='';
               document.getElementById("hotelresult").innerText='';
                for(var i=0;i<opObject.length;i++)
                {
                    if(opObject.options[i].selected)
                    {
                        
                        currentcity=opObject.options[i].text;
                        var temp = await get_cityid(currentcity);
                        currentcityid=temp;
                        
                        
                    }
                    
                }
			}
			//activate when selection of holiday change
            function get_holiday()
            {
             
                var opObject=document.holidayform.holiday;

                //获取选中的值


                for(var i=0;i<opObject.length;i++)
                {
                    if(opObject.options[i].selected)
                    {
                        
                        request_hotel(opObject.options[i].value,currentcityid);
                        get_weather(currentcity,opObject.options[i].value);
                    }
                    
                }
}            
           async function get_cityid(city){
			  
			   var temp;
				const url = 'https://priceline-com-provider.p.rapidapi.com/v1/hotels/locations?name='+city+'&search_type=CITY';
                const options = {
	            method: 'GET',
	            headers: {
	        	'X-RapidAPI-Key': '218ef62867msh43435c3235a761dp1ad0ddjsne502f1a15b2f',
		        'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com' }
                          }
                     try {
	                const response = await fetch(url, options);
                	let result = await response.json();
               	
                	for(var i=0;i<result.length;i++){
						
						if(result[i].displayLine2==currentcountry){							
							temp=result[i].cityID;		currentcity_lat=result[i].lat;currentcity_lon=result[i].lon;					
							};
						}
               if(temp==undefined){document.getElementById("hotelresult").innerText = "Can not locate this city in the database";}
                	//temp= result[0].cityID;
                     } catch (error) {
	                 console.error(error);
               }	
               //if(temp==undefined){document.getElementById("hotelresult").innerText = "Can not locate this city in the database";}
               return temp;			
			}
			 //update selection list for city-------first step
            function citylist(tem){
            	var temp=tem;
                var cil;
                for(var i=0;i<countryjson.data.length;i++)
                	{
                	if(JSON.parse(JSON.stringify(countryjson.data[i], undefined, 2), null, 3).country==temp){
                		cil=JSON.parse(JSON.stringify(countryjson.data[i], undefined, 2), null, 3).cities;
                	}
                	}
                citylist_b(cil,"citylist","city");
            }
             //update selection list for country----second step
          async  function citylist_b(arr,id,name){
            	var str="";
                var head ="<form name=\"cityForm\" action=\"\">";
                var end="</form>"
                currentcity=arr[0];
                var temp = await get_cityid(currentcity);
                        currentcityid=temp;
            	for(var i=0;i<arr.length;i++){str+="<option value="+arr[i]+">"+arr[i]+"</option>";}
            	document.getElementById(id).innerHTML=head+"<select name=\""+name+"\" onchange=\"get_city()\">"+str+"</select>"+end;
            }
            //update selection list for country
            function countryList(arr){
            	var str="";
                var head ="<form name=\"countryForm\" action=\"\">";
                var end="</form>"
            	for(var i=0;i<arr.length;i++){str+="<option value="+JSON.parse(JSON.stringify(arr[i], undefined, 2), null, 3).iso2+">"+JSON.parse(JSON.stringify(arr[i], undefined, 2), null, 3).country+"</option>";}
            	document.getElementById("colist").innerHTML=head+"<select name=\"country\" onchange=\"get_country()\">"+str+"</select>"+end;
            }
            
            //initial function to activate
            function init() {     
				document.getElementById("weather").innerText='';
				document.getElementById("hotelresult").innerText =''; 
            	document.getElementById("result").innerText='May take a few second to obtain all country';
            	 fetch('https://countriesnow.space/api/v0.1/countries')
            	  .then(res => res.json())
            	  .then(json => {
            	     countryjson=json
            	      countryList(json.data);
            	      //showList(json.data,'countryForm','colist','country','get_country()');
            	      citylist(document.countryForm.country.options[0].text);
                       request_holiday(document.countryForm.country.options[0].value);
            	    });
            	  
            	
            	
            }