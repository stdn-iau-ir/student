
function isGT_( elem, otherElemId){
		if (!elem.value)
            return true;
		var otherElem = getElement_(otherElemId); 
		if ( !otherElem)
			return true;
		if (!otherElem.value)
			return true;
		if ( otherElem.value >= elem.value ){
			var data= elem.dataset;
			var title= elem.name;
			if (data && data.title )
				title=data.title;
			var otherData= otherElem.dataset;
			var otherTitle= otherElem.name;
			if (otherData && otherData.title)
				otherTitle=otherData.title;
			alert ("<"+title+">"
					+" باید از "+  
					"<"+otherTitle+">"
					+" بزرگتر باشد");
			elem.value = "";
			return false;
		}
		return true;
	}

    function isLT_( elem, otherElemId){
        if (!elem.value)
            return true;
		var otherElem = getElement_(otherElemId); 
		if ( !otherElem)
			return true;
		if (!otherElem.value)
			return true;
		if ( otherElem.value <= elem.value ){
			var data= elem.dataset;
			var title= elem.name;
			if (data)
				title=data.title;
			var otherData= otherElem.dataset;
			var otherTitle= otherElem.name;
			if (otherData)
				otherTitle=otherData.title;
			alert ("<"+title+">"
					+" باید از "+  
					"<"+otherTitle+">"
					+" کوچکتر باشد");
			elem.value = "";
			return false;
		}
		return true;
	}

    function isGTorEQ_( elem, otherElemId){
        if (!elem.value)
            return true;
		var otherElem = getElement_(otherElemId); 
		if ( !otherElem)
			return true;
		if (!otherElem.value)
			return true;
		if ( otherElem.value > elem.value ){
			var data= elem.dataset;
			var title= elem.name;
			if (data)
				title=data.title;
			var otherData= otherElem.dataset;
			var otherTitle= otherElem.name;
			if (otherData)
				otherTitle=otherData.title;
			alert ("<"+title+">"
					+" باید از "+  
					"<"+otherTitle+">"
					+" بزرگتر یا با آن برابر باشد");
			elem.value = "";
			return false;
		}
		return true;
	}

    function isLTorEQ_( elem, otherElemId){
        if (!elem.value)
            return true;
		var otherElem = getElement_(otherElemId); 
		if ( !otherElem)
			return true;
		if (!otherElem.value)
			return true;
		if ( otherElem.value <= elem.value ){
			var data= elem.dataset;
			var title= elem.name;
			if (data)
				title=data.title;
			var otherData= otherElem.dataset;
			var otherTitle= otherElem.name;
			if (otherData)
				otherTitle=otherData.title;
			alert ("<"+title+">"
					+" باید از "+  
					"<"+otherTitle+">"
					+" کوچکتر یا با آن برابر باشد");
			elem.value = "";
			return false;
		}
		return true;
	}

    function isNotEQ_( elem, otherElemId){
        if (!elem.value)
            return true;
		var otherElem = getElement_(otherElemId); 
		if ( !otherElem)
			return true;
		if (!otherElem.value)
			return true;
		if ( otherElem.value == elem.value ){
			var data= elem.dataset;
			var title= elem.name;
			if (data)
				title=data.title;
			var otherData= otherElem.dataset;
			var otherTitle= otherElem.name;
			if (otherData)
				otherTitle=otherData.title;
			alert ("<"+title+">"
					+"نمی تواند با  "+  
					"<"+otherTitle+">"
					+" برابر باشد");
			elem.value = "";
			return false;
		}
		return true;
	}     


function generalExecValidate(formId){
		var frm = document.getElementById(formId);
		if (!frm)
			return false;
		var inputs=frm.elements;
		if (!inputs)
			return false;
		var i;
		var s=inputs.length;
		var invalidNulls = "";
		for (var i=0; i< s; i++){
			elem=inputs[i];
			if(!elem.value){
				var data = elem.dataset;
				if (!data)
					continue;
				var isMandatory= data.mandatory;
				if (isMandatory && isMandatory == 'true' ){
					var title = data.title;
					if (title)
						invalidNulls +="<"+title+">";
					else
						invalidNulls += " <"+ elem.name+"> ";
				}
			}
		}
		if (invalidNulls.length > 0 ){
			alert ("لطفا فیلد(های) اجباری زیر را تکمیل کنید" +"\n"+invalidNulls) ;
			return false;
		}
		return true;
	}
		

		
	function goExec() {
		if (!generalExecValidate("execForm")){
			return;
		}
		testForAjaxThenSubmit(document.getElementById("execForm"));
	}
