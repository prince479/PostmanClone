console.log("successs")
let addedParamCount = 0;
// utility func to get DOM element from string
function getElementFromString(string) {
    let div = document.createElement('div');
    div.innerHTML = string;
    return div.firstElementChild;
}
// HIDE parameterBox initially..
let parameterBox = document.getElementById('parametersBox');
parameterBox.style.display = 'none';

// if the user click on Param box, hide the json box 
let paramsRadio = document.getElementById('paramsRadio');
paramsRadio.addEventListener('click', () => {
    document.getElementById('requestJsonBox').style.display = 'none';
    document.getElementById('parametersBox').style.display = 'block';
})

// if the user click on json box hide the param box.
let jsonRadio = document.getElementById('jsonRadio');
jsonRadio.addEventListener('click', () => {
    document.getElementById('parametersBox').style.display = 'none';
    document.getElementById('requestJsonBox').style.display = 'block';
})
// if the clicks on + button add more parameters  
let addParam = document.getElementById('addParam');
addParam.addEventListener('click', () => {
    let params = document.getElementById('params');
    let string = `
    <div class="form-row my-2">
        <label for="url" id="urlField" class="col-sm-2 col-form-label">Parameter${addedParamCount + 2}</label>
        <div class="col-md-4">
          <input type="text" class="form-control" id="parameterKey${addedParamCount + 2}" placeholder="Parameter ${addedParamCount + 2}  Key " />
        </div>
        <div class="col-md-4">
          <input type="text" class="form-control" id="parameterValue${addedParamCount + 2}" placeholder="Parameter ${addedParamCount + 2} Value " />
        </div>
        <button  class="btn btn-primary deleteParam"> - </button>
      </div>
    `;
    // Convert the element string to dom node
    let paramElement = getElementFromString(string);
    //console.log(paramElement);
    params.append(paramElement);
    // add an addEventListener to remove the parameter on clicking - button 
    let deleteParam = document.getElementsByClassName('deleteParam');
    for (item of deleteParam) {
        item.addEventListener('click', (e) => {
                e.target.parentElement.remove();
        })
    }
    addedParamCount++;
})

// IF the user  clicks on submit button

let submit = document.getElementById('submit');
submit.addEventListener('click', () => {
	document.getElementById('responsePrism').innerHTML='Please wait... Fetching Response..';
	Prism.highlightAll();
    // fetch all the value user has entered
    let url = document.getElementById('url').value;
    let requestType = document.querySelector("input[name='type']:checked").value;
    let contentType = document.querySelector("input[name='contentType']:checked").value;
    // console.log(`${url} :${requestType}:${contentType}`)
    //if user selects params option instead of json..
    if (contentType == 'params') {
        data = {}
        for (i = 0; i < addedParamCount + 1; i++) {
            if (document.getElementById('parameterKey' + (i + 1)) != undefined) {
                let key = document.getElementById('parameterKey' + (i + 1)).value;
                let value = document.getElementById('parameterValue' + (i + 1)).value;
                data[key] = value;
            }

        }
        data=JSON.stringify(data);
    }
    else{
        data=document.getElementById('requestJsonText').value;
    }
    //if requestType is GET
    if(requestType=='GET'){
        fetch(url,{method:'GET',redirect: 'follow'})
        .then(response=>{
            return response.text()
        })
        .then(data=>{
			document.getElementById('responsePrism').innerHTML = data;
			Prism.highlightAll();
        })
        .catch(error=>{
        	document.getElementById('responsePrism').innerHTML = error;
        })
    }
    else{
		fetch(url,{
			method:'POST',
			body:data,
			headers:{
				"Content-Type":"application/json"
			},
			})
        .then(response=>{
            return response.text();;
        })
        .then(data=>{
			document.getElementById('responsePrism').innerHTML = data;
            Prism.highlightAll();
        });
		
	}
})


